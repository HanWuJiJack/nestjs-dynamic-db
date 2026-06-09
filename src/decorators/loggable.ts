// common/decorators/loggable.decorator.ts
export function Loggable(prefix?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const logPrefix = prefix || `${target.constructor.name}.${propertyKey}`;
            console.log(`[${logPrefix}] 参数:`, args);
            const start = Date.now();

            try {
                const result = await originalMethod.apply(this, args);
                console.log(`[${logPrefix}] 结果:`, result, `耗时: ${Date.now() - start}ms`);
                return result;
            } catch (error) {
                console.error(`[${logPrefix}] 错误:`, error);
                throw error;
            }
        };

        return descriptor;
    };
}