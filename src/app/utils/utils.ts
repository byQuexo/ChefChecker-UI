export const getHTTP = () => {
    return {
        post: async (url: string, data: string | Record<string, string>) => {
            const bodyData = typeof data === 'string' ? data : JSON.stringify(data);
            return await fetch(url, {
                method: "POST",
                body: bodyData,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        },

        get: async (url: string) => {
            return await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        },

        patch: async (url: string, data: Record<string, unknown>) => {
            return await fetch(url, {
              method: "PATCH",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            });
          },
    }
}