"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestRPCInterceptor = void 0;
const microservices_1 = require("@nestjs/microservices");
const operators_1 = require("rxjs/operators");
const log_1 = require("./log");
class NestRPCInterceptor {
    intercept(context, next) {
        const startTime = Date.now();
        const rpc = context.switchToRpc();
        const ctx = rpc.getContext();
        const msg = ctx.getMessage();
        let id, pattern;
        try {
            const data = JSON.parse(msg.content.toString());
            id = data.id;
            pattern = data.pattern;
        }
        catch (error) {
            (0, log_1.default)(`Error parsing message content: ${error.message}`);
            return next.handle();
        }
        (0, log_1.default)(`\x1b[34m${id ? "REQUEST" : "RECEIVED"}\x1b[0m ${id || "-"} ${pattern}`);
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - startTime;
            (0, log_1.default)(`\x1b[32m${id ? "SEND" : "EMIT"}\x1b[0m ${id || "-"} ${pattern} ${duration}ms`);
        }), (0, operators_1.catchError)(error => {
            var _a;
            console.error(error);
            const duration = Date.now() - startTime;
            let message = error.message || error;
            if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.message) {
                if (typeof error.response.message === "string")
                    message = error.response.message;
                else
                    message = error.response.message.join(", ");
            }
            (0, log_1.default)(`\x1b[31m${id ? "SEND" : "EMIT"}\x1b[0m ${id || "-"} ${pattern} ${duration}ms - \x1b[33m${message}\x1b[0m`);
            throw new microservices_1.RpcException(message);
        }));
    }
}
exports.NestRPCInterceptor = NestRPCInterceptor;
//# sourceMappingURL=index.js.map