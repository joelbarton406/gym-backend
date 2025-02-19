import { RawMember, db, members, sessions, Credentials } from "../db";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
const SALT_ROUNDS = 12;
const SESSION_DURATION = 60 * 30 * 1000; // 30 minute session

export const signup = async (rawMember: RawMember) => {
  const [existingMember] = await db
    .select()
    .from(members)
    .where(eq(members.email, rawMember.email))
    .limit(1);

  if (existingMember) {
    throw new Error("Email already in use");
  }

  const hashed_password = await bcrypt.hash(
    rawMember.plaintext_password,
    SALT_ROUNDS
  );

  const [member] = await db
    .insert(members)
    .values({
      ...rawMember,
      hashed_password,
      created_at: new Date().toISOString(),
    })
    .returning({
      id: members.id,
      email: members.email,
      hashed_password: members.hashed_password,
      created_at: members.created_at,
      phone_number: members.phone_number,
      first_name: members.first_name,
      last_name: members.last_name,
      profile_type: members.profile_type,
    });

  return member;
};

export const login = async (credentials: Credentials) => {
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.email, credentials.email))
    .limit(1);

  if (!member) {
    throw new Error("Invalid credentials, email not found");
  }

  const passwordValid = await bcrypt.compare(
    credentials.plaintext_password,
    member.hashed_password
  );

  if (!passwordValid) {
    throw new Error("Invalid credentials, incorrect password");
  }

  const sessionId = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  // Corrected insert operation
  const [session] = await db
    .insert(sessions)
    .values({
      id: sessionId,
      member_id: member.id,
      expires_at: expiresAt,
    })
    .returning(); 

  return {
    sessionId: session.id,
    member: {
      id: member.id,
      email: member.email,
      firstName: member.first_name,
      lastName: member.last_name,
      phoneNumber: member.phone_number,
      profileType: member.profile_type,
    },
  };
};

export const logout = async (sessionId: string) => {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
};
