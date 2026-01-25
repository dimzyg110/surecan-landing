import { createEvents, EventAttributes, DateArray } from "ics";

/**
 * Generate .ics calendar file for appointment
 */
export function generateAppointmentICS(appointment: {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  organizerEmail: string;
  attendeeEmail: string;
}): string | null {
  try {
    const startArray: DateArray = [
      appointment.startTime.getFullYear(),
      appointment.startTime.getMonth() + 1, // ics months are 1-indexed
      appointment.startTime.getDate(),
      appointment.startTime.getHours(),
      appointment.startTime.getMinutes(),
    ];

    const endArray: DateArray = [
      appointment.endTime.getFullYear(),
      appointment.endTime.getMonth() + 1,
      appointment.endTime.getDate(),
      appointment.endTime.getHours(),
      appointment.endTime.getMinutes(),
    ];

    const event: EventAttributes = {
      start: startArray,
      end: endArray,
      title: appointment.title,
      description: appointment.description,
      location: appointment.location,
      url: appointment.location, // Video call link
      status: "CONFIRMED",
      busyStatus: "BUSY",
      organizer: {
        name: "Surecan Clinic",
        email: appointment.organizerEmail,
      },
      attendees: [
        {
          name: "Patient",
          email: appointment.attendeeEmail,
          rsvp: true,
          partstat: "NEEDS-ACTION",
          role: "REQ-PARTICIPANT",
        },
      ],
      alarms: [
        {
          action: "display",
          description: "Reminder: Appointment in 24 hours",
          trigger: { hours: 24, minutes: 0, before: true },
        },
        {
          action: "display",
          description: "Reminder: Appointment in 1 hour",
          trigger: { hours: 1, minutes: 0, before: true },
        },
      ],
    };

    const { error, value } = createEvents([event]);

    if (error) {
      console.error("[Calendar] Error generating ICS:", error);
      return null;
    }

    return value || null;
  } catch (error) {
    console.error("[Calendar] Failed to generate ICS:", error);
    return null;
  }
}
