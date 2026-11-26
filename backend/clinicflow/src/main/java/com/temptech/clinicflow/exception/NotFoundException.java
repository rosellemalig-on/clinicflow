package com.temptech.clinicflow.exception;

// ============================================================
// OWNER   : TEAM (shared)
// FEATURE : Shared
// ============================================================

public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }
}
