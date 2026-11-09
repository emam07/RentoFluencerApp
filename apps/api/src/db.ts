// Database client module
// The PrismaClient instance is initialized in src/index.ts via dynamic import
// and stored as a module-level singleton. Route modules import this.

// Use require() compatible export for ESM + CJS interop
// The index.ts sets the actual PrismaClient instance before routes load
export default null as any;