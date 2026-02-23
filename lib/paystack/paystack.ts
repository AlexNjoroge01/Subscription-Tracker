/**
 * Paystack Payment Integration Service
 * Documentation: https://paystack.com/docs/api/
 */

interface PaystackConfig {
  secretKey: string;
  publicKey: string;
  baseUrl: string;
}

const config: PaystackConfig = {
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  baseUrl: 'https://api.paystack.co',
};

// Initialize Paystack client
function getPaystackClient() {
  if (!config.secretKey) {
    throw new Error('PAYSTACK_SECRET_KEY is not defined in environment variables');
  }
  return config;
}

export interface InitializePaymentParams {
  email: string;
  amount: number; // Amount in base currency units (will be converted to kobo)
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  currency?: string; // 'KES' or 'USD'
}

export interface InitializePaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface VerifyPaymentResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, unknown>;
    log: Record<string, unknown>;
    fees: number;
    fees_split: Record<string, unknown> | null;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: Record<string, unknown>;
      risk_action: string;
    };
  };
}

/**
 * Initialize a payment transaction
 */
export async function initializePayment(
  params: InitializePaymentParams
): Promise<InitializePaymentResponse> {
  const client = getPaystackClient();
  
  // Paystack expects amount in kobo (smallest currency unit)
  // For KES: 1 KES = 100 kobo
  // For USD: 1 USD = 100 cents
  const amountInSmallestUnit = Math.round(params.amount * 100);
  const currency = params.currency || 'KES';

  const response = await fetch(`${client.baseUrl}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${client.secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: amountInSmallestUnit,
      currency,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Paystack API error: ${error}`);
  }

  return response.json();
}

/**
 * Verify a payment transaction
 */
export async function verifyPayment(
  reference: string
): Promise<VerifyPaymentResponse> {
  const client = getPaystackClient();

  const response = await fetch(
    `${client.baseUrl}/transaction/verify/${reference}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${client.secretKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Paystack API error: ${error}`);
  }

  return response.json();
}

/**
 * Generate a unique payment reference
 */
export function generatePaymentReference(userId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `subtrack_${userId.slice(0, 8)}_${timestamp}_${random}`;
}

/**
 * Get the Paystack public key for frontend
 */
export function getPaystackPublicKey(): string {
  return config.publicKey;
}

/**
 * List payment plans (for creating subscription plans in Paystack)
 */
export async function listPlans() {
  const client = getPaystackClient();

  const response = await fetch(`${client.baseUrl}/plan`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${client.secretKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Paystack API error: ${error}`);
  }

  return response.json();
}

/**
 * Create a payment plan in Paystack
 */
export async function createPlan(params: {
  name: string;
  amount: number;
  interval: 'daily' | 'weekly' | 'monthly' | 'annually';
  description?: string;
  currency?: string;
}) {
  const client = getPaystackClient();

  const response = await fetch(`${client.baseUrl}/plan`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${client.secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: params.name,
      amount: Math.round(params.amount * 100), // Convert to kobo
      interval: params.interval,
      description: params.description,
      currency: params.currency || 'KES',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Paystack API error: ${error}`);
  }

  return response.json();
}
