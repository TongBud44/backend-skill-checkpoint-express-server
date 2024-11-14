# Q&A API

A RESTful API built with Express and PostgreSQL for managing questions and answers.

## Features

- **Questions**: Create, view, search, delete.
- **Answers**: Add answers to questions, view all answers for a question.
- **Voting**: Upvote or downvote questions and answers. (Now, this version still can not voting the question posts or voting the answers)

## API Endpoints

### Questions

- `POST /questions` - Create a question.
- `GET /questions` - View all questions.
- `GET /questions/:questionId` - View a specific question.
- `POST /questions/search?title=&category=` - Search questions by title or category.
- `DELETE /questions/:questionId` - Delete a question.

### Answers

- `POST /questions/:questionId/answers` - Add an answer to a question.
- `GET /questions/:questionId/answers` - View all answers for a question.

## Environment Variables

Set up:

- `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
