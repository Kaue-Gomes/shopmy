import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import * as bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // Apenas Credentials + JWT: não precisamos do PrismaAdapter (evita chamadas extra à BD no fluxo de sessão).
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        // Verificar senha usando bcrypt
        const isValidPassword = await bcrypt.compare(credentials.password, user.password || '')

        if (isValidPassword) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      // Sem utilizador autenticado o NextAuth pode não preencher `session.user`; não aceder a `.id` nesse caso.
      if (session.user) {
        if (token?.sub) {
          session.user.id = token.sub
        }
        if (token?.role !== undefined) {
          session.user.role = token.role as string
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}
