const express = require('express');
const path = require('path');
const GraphModel = require('./graph-model');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const examGraph = new GraphModel();
let questionCount = 0;

// Admin API to add questions
app.post('/api/teacher/add-question', (req, res) => {
  const { text, options, correctAnswerIndex } = req.body;
  questionCount++;
  const qId = `q_${questionCount}`;
  
  examGraph.addVertex(qId, 'question', { text });
  
  options.forEach((optText, index) => {
    const oId = `${qId}_opt_${index}`;
    examGraph.addVertex(oId, 'option', { text: optText, isCorrect: index === correctAnswerIndex });
    examGraph.addEdge(qId, oId, 'has_option');
  });

  res.json({ success: true, questionId: qId });
});

app.post('/api/student/login', (req, res) => {
  const { studentId } = req.body;
  if (!studentId || studentId.trim() === '') return res.status(400).json({success: false, error: "Invalid ID"});
  examGraph.addVertex(studentId, 'student', { name: studentId });
  res.json({ success: true, studentId });
});

app.get('/api/questions', (req, res) => {
  const nodes = Array.from(examGraph.vertices.values());
  const edges = Array.from(examGraph.edges.values());
  
  let questions = nodes.filter(n => n.type === 'question');
  let qData = questions.map(q => {
     let qEdges = edges.filter(e => e.from === q.id && e.type === 'has_option');
     let options = qEdges.map(e => nodes.find(n => n.id === e.to)).filter(n => n);
     return { id: q.id, text: q.data.text, options: options.map(o => ({ id: o.id, text: o.data.text })) };
  });

  res.json(qData);
});

app.post('/api/submit', (req, res) => {
  const { studentId, questionId, optionId } = req.body;
  const result = examGraph.submitAnswer(studentId, questionId, optionId);
  res.json(result);
});

app.get('/api/graph', (req, res) => {
  res.json(examGraph.getGraphData());
});

app.get('/api/time', (req, res) => {
   const timeNode = examGraph.vertices.get('time_exam');
   res.json({ 
      start: timeNode.data.start, 
      duration: timeNode.data.duration, 
      now: Date.now() 
   });
});

app.post('/api/reset-time', (req, res) => {
   examGraph.initializeTimeNode();
   res.json({ success: true });
});

app.post('/api/reset-data', (req, res) => {
   examGraph.vertices.clear();
   examGraph.edges.clear();
   examGraph.initializeTimeNode();
   questionCount = 0;
   res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
