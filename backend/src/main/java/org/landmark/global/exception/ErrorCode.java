package org.landmark.global.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public enum ErrorCode {

  // 400 Bad Request
  INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "유효하지 않은 입력 값입니다."),
  INVALID_METHOD(HttpStatus.BAD_REQUEST, "지원하지 않는 HTTP 메서드입니다."),
  PROPOSAL_CANNOT_CANCEL(HttpStatus.BAD_REQUEST, "이미 종료된(통과/부결/취소) 제안은 취소할 수 없습니다."),
  INVALID_PROPOSAL_DATE(HttpStatus.BAD_REQUEST, "투표 종료 시간은 시작 시간보다 미래여야 합니다."),

  // 401 Unauthorized
  UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "인증이 필요합니다."),
  INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
  EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
  INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 리프레시 토큰입니다."),

  // 403 Forbidden
  FORBIDDEN_EXCEPTION(HttpStatus.FORBIDDEN, "해당 요청에 대한 권한이 없습니다."),

  // 404 Not Found
  USER_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다."),
  PROPERTY_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 부동산 상품입니다."),
  PROPOSAL_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 제안입니다."),
  PAYMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 결제 건입니다."),

  // 422 — Payment / Wallet
  WALLET_NOT_LINKED(HttpStatus.UNPROCESSABLE_ENTITY, "지갑이 연결되지 않았습니다. 먼저 지갑을 연결해주세요."),

  // 422 Unprocessable Entity
  ALREADY_MINTED(HttpStatus.UNPROCESSABLE_ENTITY, "이미 토큰이 발행된 부동산입니다."),
  VALUATION_FAILED(HttpStatus.UNPROCESSABLE_ENTITY, "부동산 가치 평가에 실패했습니다."),

  // 404 Not Found - Rental Income
  VIRTUAL_ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 가상계좌입니다."),
  RENTAL_INCOME_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 임대 수익 기록입니다."),

  // 422 Unprocessable Entity - Rental Income
  VIRTUAL_ACCOUNT_ALREADY_EXISTS(HttpStatus.UNPROCESSABLE_ENTITY, "이미 발급된 가상계좌가 있습니다."),
  RENTAL_INCOME_DISTRIBUTION_FAILED(HttpStatus.UNPROCESSABLE_ENTITY, "임대 수익 분배에 실패했습니다."),

  // 500 Internal Server Error
  INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다."),
  PAYMENT_API_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "결제 API 통신 중 오류가 발생했습니다."),

  // Blockchain - Connection & Server
  BLOCKCHAIN_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "블록체인 서버와의 통신 중 오류가 발생했습니다."),
  BLOCKCHAIN_NOT_INITIALIZED(HttpStatus.INTERNAL_SERVER_ERROR, "블록체인 연동이 초기화되지 않았습니다."),

  // Blockchain - Transaction
  BLOCKCHAIN_TRANSACTION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "블록체인 트랜잭션 전송에 실패했습니다."),
  BLOCKCHAIN_TRANSACTION_NOT_FOUND(HttpStatus.NOT_FOUND, "트랜잭션을 찾을 수 없습니다."),
  BLOCKCHAIN_TRANSACTION_RECEIPT_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "트랜잭션 영수증 조회에 실패했습니다."),

  // Blockchain - Query & Interface
  BLOCKCHAIN_BALANCE_QUERY_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "블록체인 잔액 조회에 실패했습니다."),
  BLOCKCHAIN_INTERFACE_NOT_READY(HttpStatus.UNPROCESSABLE_ENTITY, "블록체인 인터페이스가 아직 준비되지 않았습니다."),

  // Blockchain - KRWT Transfer
  INSUFFICIENT_KRWT_BALANCE(HttpStatus.UNPROCESSABLE_ENTITY, "백엔드 지갑의 KRWT 잔액이 부족합니다."),
  BLOCKCHAIN_KRWT_TRANSFER_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "KRWT 토큰 전송에 실패했습니다.");

  private final HttpStatus status;
  private final String message;

  public int getCode() {
    return this.status.value();
  }
}
