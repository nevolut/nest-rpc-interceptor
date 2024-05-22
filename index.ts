import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import log from "./log";

export class NestRPCInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    const rpc = context.switchToRpc();
    const ctx = rpc.getContext();
    const msg = ctx.getMessage();
    let id: string, pattern: string;

    try {
      const data = JSON.parse(msg.content.toString());
      id = data.id;
      pattern = data.pattern;
    } catch (error) {
      log(`Error parsing message content: ${error.message}`);
      return next.handle();
    }

    log(`\x1b[34m${id ? "REQUEST" : "RECEIVED"}\x1b[0m ${id || "-"} ${pattern}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        log(`\x1b[32m${id ? "SEND" : "EMIT"}\x1b[0m ${id || "-"} ${pattern} ${duration}ms`);
      }),
      catchError(error => {
        console.error(error);

        const duration = Date.now() - startTime;
        let message = error.message || error;

        if (error.response?.message) {
          if (typeof error.response.message === "string") message = error.response.message;
          else message = error.response.message.join(", ");
        }

        log(
          `\x1b[31m${id ? "SEND" : "EMIT"}\x1b[0m ${
            id || "-"
          } ${pattern} ${duration}ms - \x1b[33m${message}\x1b[0m`
        );

        throw new RpcException(message);
      })
    );
  }
}
