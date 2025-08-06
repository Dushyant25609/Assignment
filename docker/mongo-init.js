// MongoDB initialization script
db = db.getSiblingDB('assignment_db');

// Create a user for the application
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'assignment_db'
    }
  ]
});

// Create initial collections with indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

db.posts.createIndex({ userId: 1 });
db.posts.createIndex({ createdAt: -1 });
db.posts.createIndex({ title: 'text', content: 'text' });

print('Database initialized successfully');
