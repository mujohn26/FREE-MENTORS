import dotenv from 'dotenv';

dotenv.config();
class ReviewModal {
  constructor(reviewId, sessionid, mentorId, menteeId, score, menteeFullName, remark) {
    this.reviewId = reviewId;
    this.sessionId = sessionid;
    this.mentorId = mentorId;
    this.menteeId = menteeId;
    this.score = score;
    this.menteeFullName = menteeFullName;
    this.remark = remark;
  }
}


export default ReviewModal;
