class ParticipantService {
    constructor(participants = []) {
      this.participants = participants;
    }
  
    addParticipant({ name, phone }) {
      if (!name || !phone || this.participants.some((p) => p.phone === phone)) {
        return this.participants; // Return the same array if invalid
      }
  
      return [...this.participants, { name, phone }];
    }
  
    removeParticipant(phone) {
      return this.participants.filter((p) => p.phone !== phone);
    }
  }
  
  export default ParticipantService;
  