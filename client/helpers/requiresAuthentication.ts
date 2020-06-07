import { AuthenticationError } from 'apollo-server-micro'

export function requiresAuthentication(fn) {
  return function resolve(parent, args, context) {
    if (context.isMe) return fn(parent, args, context)
    throw new AuthenticationError('You must be logged in')
  }
}