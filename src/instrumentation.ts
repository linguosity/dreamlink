export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize monitoring/logging here
  }
}

export async function onRequestError(err: Error, request: Request, context: {
  route: string;
  serverComponent: boolean;
  serverAction: boolean;
  routeHandler: boolean;
  middleware: boolean;
}) {
  console.error('Request error:', {
    error: err.message,
    route: context.route,
    url: request.url,
  });
}
