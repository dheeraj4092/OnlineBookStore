-- Create shipping_details table
CREATE TABLE IF NOT EXISTS shipping_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for shipping_details table
ALTER TABLE shipping_details ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shipping_details
CREATE POLICY "Allow public read access to shipping_details" ON shipping_details
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert shipping_details" ON shipping_details
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update shipping_details" ON shipping_details
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete shipping_details" ON shipping_details
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_shipping_details_updated_at
  BEFORE UPDATE ON shipping_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 