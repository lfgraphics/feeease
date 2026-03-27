
export interface CreateDnsRecordInput {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV' | 'CAA';
  name: string;
  content: string;
  proxied?: boolean;
  ttl?: number;
  priority?: number;
  comment?: string;
}

export interface DnsRecord {
  id: string;
  zone_id: string;
  zone_name: string;
  name: string;
  type: string;
  content: string;
  proxied: boolean;
  ttl: number;
  locked: boolean;
  meta?: {
    auto_added?: boolean;
  };
  created_on: string;
  modified_on: string;
}

export interface DnsUsage {
  usage: number;
  limit: number;
  period: string;
  zoneName?: string;
}


class CloudflareDnsManager {
  private get apiToken() { return process.env.CLOUDFLARE_API_TOKEN!; }
  private get zoneId() { return process.env.CLOUDFLARE_ZONE_ID!; }

  private async fetch(endpoint: string, options?: RequestInit) {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('Cloudflare API Error:', JSON.stringify(data.errors || data, null, 2));
      throw new Error(data.errors?.[0]?.message || 'Cloudflare API error');
    }

    return data;
  }

  async listRecords(options?: {
    name?: string;
    type?: string;
    content?: string;
    proxied?: boolean;
    per_page?: number;
  }): Promise<DnsRecord[]> {
    const queryParams = new URLSearchParams();
    if (options?.name) queryParams.append('name', options.name);
    if (options?.type) queryParams.append('type', options.type);
    if (options?.content) queryParams.append('content', options.content);
    if (options?.proxied !== undefined) queryParams.append('proxied', String(options.proxied));
    queryParams.append('per_page', String(options?.per_page || 100));

    const data = await this.fetch(
      `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records?${queryParams}`
    );
    return data.result;
  }


  async createRecord(input: CreateDnsRecordInput): Promise<DnsRecord> {
    const data = await this.fetch(
      `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records`,
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    );
    return data.result;
  }

  async getRecord(recordId: string): Promise<DnsRecord> {
    const data = await this.fetch(
      `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records/${recordId}`
    );
    return data.result;
  }

  async updateRecord(
    recordId: string,
    updates: Partial<CreateDnsRecordInput>
  ): Promise<DnsRecord> {
    const data = await this.fetch(
      `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records/${recordId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }
    );
    return data.result;
  }

  async deleteRecord(recordId: string): Promise<void> {
    await this.fetch(
      `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records/${recordId}`,
      {
        method: 'DELETE',
      }
    );
  }

  async getUsage(): Promise<DnsUsage> {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const zoneId = process.env.CLOUDFLARE_ZONE_ID;

    if (!apiToken || !zoneId) {
        throw new Error("Cloudflare configuration missing (API Token or Zone ID)");
    }

    let zoneName = "Cloudflare API";
    let limit = 3500;

    try {
        const zoneData = await this.fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}`);
        zoneName = zoneData.result.name;
        const plan = zoneData.result.plan?.name?.toLowerCase();
        if (plan === 'free') limit = 1000;
        else if (plan === 'pro') limit = 3500;
        else if (plan === 'business') limit = 3500;
    } catch (e) {
        console.error("Failed to fetch zone details:", e);
    }

    try {
        // Specifically for enterprise or specific accounts, trying the metadata route
        const data = await this.fetch(
          `https://api.cloudflare.com/client/v4/zones/${this.zoneId}/dns_records?per_page=1`
        );
        const totalCount = data.result_info?.total_count;
        
        if (typeof totalCount === 'number') {
            return {
                usage: totalCount,
                limit: limit,
                period: 'count',
                zoneName
            };
        }
        
        throw new Error("Could not extract record count from Cloudflare response");
    } catch (e) {
        console.error("Critical DNS Fetch Error:", e);
        throw e; // Let the API route handle the error response
    }
  }





  async checkSubdomainExists(subdomain: string): Promise<DnsRecord | null> {
    try {
      const records = await this.listRecords({ name: subdomain });
      return records.length > 0 ? records[0] : null;
    } catch {
      return null;
    }
  }

  async createSubdomain(
    clientName: string,
    target: string,
    type: 'A' | 'AAAA' | 'CNAME' = 'CNAME',
    proxied: boolean = true
  ): Promise<DnsRecord> {
    // Determine the root domain from Zone ID or an env var. 
    // For now, let's assume we want to create [clientName].rootdomain.com
    // We can try to get zone details to find the name if not provided.
    
    let zoneName = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    if (!zoneName) {
        const zoneData = await this.fetch(`https://api.cloudflare.com/client/v4/zones/${this.zoneId}`);
        zoneName = zoneData.result.name;
    }

    const subdomain = `${clientName}.${zoneName}`;
    
    // Check if subdomain already exists
    const existing = await this.checkSubdomainExists(subdomain);
    if (existing) {
      throw new Error(`Subdomain ${subdomain} already exists`);
    }

    return this.createRecord({
      type,
      name: subdomain,
      content: target,
      proxied,
      ttl: 1, // Auto TTL
    });
  }
}

export const cloudflareDns = new CloudflareDnsManager();
