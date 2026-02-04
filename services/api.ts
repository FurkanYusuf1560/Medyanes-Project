
// Generic fetch wrapper
const fetchApi = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        // Try to parse error message
        try {
            const errorData = await res.json();
            throw new Error(errorData.message || 'API Error');
        } catch (e) {
            if (e instanceof Error && (e as any).message?.includes('Unexpected token')) {
                const text = await res.text();
                console.error('API returned non-JSON error:', text);
                throw new Error(`Server Error (${res.status}): Please check server logs.`);
            }
            throw e;
        }
    }

    return res.json();
};

export const getApi = <T>(url: string) => fetchApi<T>(url, { method: 'GET' });

export const postApi = <T>(url: string, data: any) =>
    fetchApi<T>(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });

export const putApi = <T>(url: string, data: any) =>
    fetchApi<T>(url, {
        method: 'PUT',
        body: JSON.stringify(data),
    });

export const deleteApi = <T>(url: string) => fetchApi<T>(url, { method: 'DELETE' });
