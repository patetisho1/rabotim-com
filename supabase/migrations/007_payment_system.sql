-- Payment system tables
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL, -- 'task_promotion', 'premium_subscription', 'one_time_payment'
  plan_id VARCHAR(100) NOT NULL,
  amount INTEGER NOT NULL, -- Amount in stotinki (smallest currency unit)
  currency VARCHAR(3) NOT NULL DEFAULT 'bgn',
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded', 'cancelled'
  stripe_payment_intent_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Premium subscriptions table
CREATE TABLE premium_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id VARCHAR(100) NOT NULL,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'past_due'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id VARCHAR(255) UNIQUE,
  type VARCHAR(50) NOT NULL, -- 'card', 'bank_account', etc.
  is_default BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment history table for audit trail
CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'created', 'completed', 'failed', 'refunded', etc.
  amount INTEGER,
  currency VARCHAR(3),
  status VARCHAR(20),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_task_id ON payments(task_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_stripe_subscription_id ON payments(stripe_subscription_id);

CREATE INDEX idx_premium_subscriptions_user_id ON premium_subscriptions(user_id);
CREATE INDEX idx_premium_subscriptions_status ON premium_subscriptions(status);
CREATE INDEX idx_premium_subscriptions_stripe_subscription_id ON premium_subscriptions(stripe_subscription_id);

CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_stripe_payment_method_id ON payment_methods(stripe_payment_method_id);

CREATE INDEX idx_payment_history_payment_id ON payment_history(payment_id);

-- RLS policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Payments policies
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" ON payments
  FOR UPDATE USING (auth.uid() = user_id);

-- Premium subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON premium_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" ON premium_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON premium_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Payment methods policies
CREATE POLICY "Users can view their own payment methods" ON payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment methods" ON payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods" ON payment_methods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods" ON payment_methods
  FOR DELETE USING (auth.uid() = user_id);

-- Payment history policies
CREATE POLICY "Users can view payment history for their payments" ON payment_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM payments 
      WHERE payments.id = payment_history.payment_id 
      AND payments.user_id = auth.uid()
    )
  );

-- Functions for payment processing
CREATE OR REPLACE FUNCTION update_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the updated_at timestamp
  NEW.updated_at = NOW();
  
  -- Insert into payment history
  INSERT INTO payment_history (payment_id, action, amount, currency, status, metadata)
  VALUES (NEW.id, 'status_updated', NEW.amount, NEW.currency, NEW.status, NEW.metadata);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for payment status updates
CREATE TRIGGER trigger_update_payment_status
  BEFORE UPDATE ON payments
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_payment_status();

-- Function to check if user has active premium subscription
CREATE OR REPLACE FUNCTION user_has_premium_subscription(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM premium_subscriptions 
    WHERE user_id = user_uuid 
    AND status = 'active' 
    AND current_period_end > NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get user's premium features
CREATE OR REPLACE FUNCTION get_user_premium_features(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  features JSONB := '{}';
  has_premium BOOLEAN;
BEGIN
  has_premium := user_has_premium_subscription(user_uuid);
  
  features := jsonb_build_object(
    'has_premium', has_premium,
    'unlimited_tasks', has_premium,
    'advanced_analytics', has_premium,
    'priority_support', has_premium,
    'custom_branding', has_premium,
    'expires_at', (
      SELECT current_period_end 
      FROM premium_subscriptions 
      WHERE user_id = user_uuid 
      AND status = 'active' 
      LIMIT 1
    )
  );
  
  RETURN features;
END;
$$ LANGUAGE plpgsql;


