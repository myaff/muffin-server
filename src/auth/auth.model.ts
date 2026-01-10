export enum JwtSubjects {
  ACCESS = 'access',
  REFRESH = 'refresh',
}
export interface JwtObject {
  sub: JwtSubjects;
  iss: number;
  iat: number;
  exp: number;
}
export interface JwtObjectAccess extends JwtObject {
  sub: JwtSubjects.ACCESS;
  email: string;
}
export interface JwtObjectRefresh extends JwtObject {
  sub: JwtSubjects.REFRESH;
  aud: number;
}
