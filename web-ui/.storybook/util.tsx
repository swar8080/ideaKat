function simulateNetworkCall<T>(value: T): Promise<T> {
    return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (value != null){
                    resolve(value);
                }
                else {
                    reject();
                }
            }, 1000)
        }
    );
}