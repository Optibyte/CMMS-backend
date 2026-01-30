-- Sample value 
INSERT INTO
    workflow_status (value, label)
VALUES
    (0, 'To Do'),
    (1, 'Pending'),
    (2, 'In Progress'),
    (3, 'Completed'),
    (4, 'Approved'),
    (5, 'Pending Approval'),
    (6, 'Submitted')
    (7, 'Overdue');

INSERT INTO
    workflow_priority (value, label, created_at, updated_at)
VALUES
    ('0', 'Low Priority', NOW(), NOW()),
    ('1', 'Medium Priority', NOW(), NOW()),
    ('2', 'High Priority', NOW(), NOW()),
    ('3', 'Critical Priority', NOW(), NOW());