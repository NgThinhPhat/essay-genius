package com.phat.common.exception.file;

import com.phat.common.exception.AppErrorCode;
import com.phat.common.exception.AppException;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class FileException extends com.phat.common.exception.AppException {

  public FileException(
      FileErrorCode fileErrorCode, HttpStatus httpStatus, String reason, Object... moreInfo) {
    super(AppErrorCode.valueOf(fileErrorCode.getMessage()), httpStatus, reason, moreInfo);
    this.fileErrorCode = fileErrorCode;
  }

  private final FileErrorCode fileErrorCode;
}
