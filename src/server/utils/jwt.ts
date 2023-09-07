import jwt from "jsonwebtoken";

export const signJwt = (userId: number) =>
  new Promise((res, rej) => {
    jwt.sign(
      { userId },
      process.env.ACCESS_TOKEN_PRIVATE_KEY!,
      { algorithm: "RS256" },
      (err, token) => {
        if (err) {
          rej(err);
        } else {
          res(token);
        }
      }
    );
  });

export const verifyJwt = <T>(token: string): Promise<T> =>
  new Promise((res, rej) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_PUBLIC_KEY!, (err, decoded) => {
      if (err) {
        rej(err);
      } else {
        res(decoded as T);
      }
    });
  });
