package com.temptech.clinicflow.exception;

// ============================================================
// OWNER   : Malig-on
// FEATURE : Book Appointment
// ============================================================

public class SlotFullException extends RuntimeException {

    public SlotFullException(String message) {
        super(message);
    }
}
