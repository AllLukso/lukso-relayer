type Quota = {
  id: number;
  monthly_gas: number;
  gas_used: number;
  estimated_gas_used: number;
  universal_profile_address: string;
};

export default Quota;
