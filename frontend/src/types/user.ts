/** 백엔드 UserResponseDto와 1:1 매핑 */
export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  point: number;
}

/** 회원가입·수정 요청용. updatedAt 등은 서버에서 설정하므로 클라이언트에서는 보내지 않음 */
export interface SignInRequestDto {
  name: string;
  email: string;
  address?: string;
  phone?: string;
  password: string;
  passwordConfirm: string;
}
/** 로그인 요청용. email과 password는 필수 */
export interface LoginRequestDto {
  email: string;
  password: string;
}
