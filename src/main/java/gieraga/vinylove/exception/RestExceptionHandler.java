package gieraga.vinylove.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Map;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(value = { IllegalStateException.class })
    protected ResponseEntity<Object> handleConflict(IllegalStateException ex, WebRequest request) {
        Map<String, String> bodyOfResponse = Map.of("message", ex.getMessage());
        return new ResponseEntity<>(bodyOfResponse, HttpStatus.CONFLICT);
    }
}