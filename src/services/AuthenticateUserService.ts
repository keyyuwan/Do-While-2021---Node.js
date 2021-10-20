// Regra de negócio da camada de serviço
import axios from "axios";
import { sign } from "jsonwebtoken";
import { prismaClient } from "../prisma";

/**
 * Receber code(string)
 * Recuperar o access_token no github (token que nos possibilita ter as info do user)
 * Recuperar infos do user no github
 * Verificar se o user existe no DB
 * Se SIM, geramos um token
 * Se NÃO, criamos ele no DB e geramos um token
 * Retornar o token com as infos do user logado
 */

interface IAccessTokenRes {
  access_token: string;
}

interface IUserRes {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    const url = "https://github.com/login/oauth/access_token";

    const { data: accessTokenRes } = await axios.post<IAccessTokenRes>(
      url,
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    const response = await axios.get<IUserRes>("https://api.github.com/user", {
      headers: {
        authorization: `Bearer ${accessTokenRes.access_token}`,
      },
    });

    const { login, id, avatar_url, name } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name,
        },
      });
    }

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return { token, user };
  }
}

export { AuthenticateUserService };
