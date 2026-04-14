class GraphModel {
  constructor() {
    this.vertices = new Map(); 
    this.edges = new Map();    
    this.timeNodeId = 'time_exam';
    this.initializeTimeNode();
  }

  initializeTimeNode() {
    this.vertices.set(this.timeNodeId, { id: this.timeNodeId, type: 'time', data: { start: Date.now(), duration: 60 * 1000 } });
  }

  addVertex(id, type, data = {}) {
    if (!this.vertices.has(id)) {
      this.vertices.set(id, { id, type, data });
    }
  }

  addEdge(from, to, type) {
    const edgeId = `${from}-${type}-${to}`;
    if (!this.edges.has(edgeId)) {
       this.edges.set(edgeId, { id: edgeId, from, to, type });
    }
  }

  hasAnswered(studentId, questionId) {
    const submissionNodeId = `sub_${studentId}_${questionId}`;
    return this.vertices.has(submissionNodeId);
  }

  submitAnswer(studentId, questionId, optionId) {
    const timeNode = this.vertices.get(this.timeNodeId);
    if (!timeNode) return { success: false, error: 'Exam time node not found' };

    const now = Date.now();
    const elapsedTime = now - timeNode.data.start;
    
    if (elapsedTime > timeNode.data.duration) {
      return { success: false, error: 'Time Over' }; // Time Constraint Rejection!
    }

    if (this.hasAnswered(studentId, questionId)) {
        return { success: false, error: 'Duplicate Submission Not Allowed' }; // Capacity Constraint!
    }

    // Creating the complex graph representation of a submission
    const submissionId = `sub_${studentId}_${questionId}`;
    this.addVertex(submissionId, 'submission', { studentId, questionId, optionId, timestamp: now });
    
    // Si -> Aij
    this.addEdge(studentId, submissionId, 'submits');
    // Aij -> Qj
    this.addEdge(submissionId, questionId, 'answers');
    // Aij -> Ojk
    this.addEdge(submissionId, optionId, 'selects');
    // Topen -> Aij (Time bounds connection)
    this.addEdge(this.timeNodeId, submissionId, 'valid_time');

    return { success: true };
  }

  getGraphData() {
    return {
      nodes: Array.from(this.vertices.values()),
      edges: Array.from(this.edges.values())
    };
  }

  getStudentStatus(studentId) {
    let hasSubmitted = false;
    for (const edge of this.edges.values()) {
      if (edge.from === studentId && (edge.type === 'submits' || edge.type === 'completed_exam')) {
        hasSubmitted = true;
        break;
      }
    }
    const score = hasSubmitted ? this.calculateStudentScore(studentId) : null;
    return { hasSubmitted, score };
  }

  calculateStudentScore(studentId) {
    let score = 0;
    for (const edge of this.edges.values()) {
      if (edge.from === studentId && edge.type === 'submits') {
        const submissionId = edge.to;
        for (const selectEdge of this.edges.values()) {
          if (selectEdge.from === submissionId && selectEdge.type === 'selects') {
             const optionNode = this.vertices.get(selectEdge.to);
             if (optionNode && optionNode.data && optionNode.data.isCorrect) {
               score++;
             }
             break;
          }
        }
      }
    }
    return score;
  }

  calculateAllScores() {
    let results = [];
    let students = Array.from(this.vertices.values()).filter(n => n.type === 'student');
    const totalQuestions = Array.from(this.vertices.values()).filter(n => n.type === 'question').length;
    
    for (const s of students) {
      const status = this.getStudentStatus(s.id);
      if (status.hasSubmitted) {
         results.push({
            studentId: s.id,
            score: status.score,
            totalQuestions
         });
      }
    }
    
    return results.sort((a,b) => b.score - a.score);
  }
}

module.exports = GraphModel;
