class ParticipantService {
    constructor(participants = []) {
      this.participants = participants;
    }
  
    addParticipant({ name, email, details = '' }) {
      if (!name || !email || this.participants.some((p) => p.email === email)) {
        return this.participants; // Return the same array if invalid
      }
  
      return [...this.participants, { name, email, details }];
    }
  
    removeParticipant(email) {
      return this.participants.filter((p) => p.email !== email);
    }
  }

  export default ParticipantService;
