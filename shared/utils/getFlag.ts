export function getFlag(flags : string): string{
  const args = Bun.argv
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flags) {
      return args[i + 1]
    }
  }
  return "" 
}