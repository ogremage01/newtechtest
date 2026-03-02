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

/** 회원가입 요청용 */
export interface SignInRequestDto {
  name: string;
  email: string;
  address?: string;
  phone?: string;
  password: string;
  passwordConfirm: string;
}
/** 회원 수정 요청용 */
export interface UserUpdateRequestDto {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
  password?: string;
  passwordConfirm?: string;
}
/** 로그인 요청용. email과 password는 필수 */
export interface LoginRequestDto {
  email: string;
  password: string;
}
/** 회원 관리 공통 필드 (응답/요청 공유) */
export interface UserManagementBase {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  role: string;
  point: number;
  userMemo: string;
}
/** 회원 관리 정보 응답용 */
export interface UserManagementResponseDto extends UserManagementBase {
  createdAt: Date;
  updatedAt: Date;
}
/** 회원 관리 요청용 */
export interface UserManagementRequestDto extends UserManagementBase {
  pointChange: number;
}