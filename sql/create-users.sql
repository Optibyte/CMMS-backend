-- Create user query

INSERT INTO users (id, username, email, role_id, password) VALUES
(uuid_generate_v4(), 'prawin', 'prawin.technician@example.com', (SELECT id FROM role WHERE code = 'TECHNICIAN'), 'Sriram@98'),
(uuid_generate_v4(), 'srihari', 'srihari.engineer@example.com', (SELECT id FROM role WHERE code = 'ENGINEER'), 'Sriram@98'),
(uuid_generate_v4(), 'ajaykumar', 'ajaykumar.hod@example.com', (SELECT id FROM role WHERE code = 'HOD'), 'Sriram@98'),
(uuid_generate_v4(), 'vijaykumar', 'vijaykumar.cxo@example.com', (SELECT id FROM role WHERE code = 'CXO'), 'Sriram@98');

-- Assign srihari (Engineer) as a supervisor for prawin (Technician)
INSERT INTO user_supervisor (user_id, supervisor_id) VALUES 
((SELECT id FROM users WHERE username =  'prawin'), (SELECT id FROM users WHERE username =  'srihari'));

-- Assign ajaykumar (HOD) as a supervisor for srihari (Engineer)
INSERT INTO user_supervisor (user_id, supervisor_id) VALUES 
((SELECT id FROM users WHERE username =  'srihari'), (SELECT id FROM users WHERE username =  'ajaykumar'));

-- Assign vijaykumar (CXO) as a supervisor for ajaykumar (HOD)
INSERT INTO user_supervisor (user_id, supervisor_id) VALUES 
((SELECT id FROM users WHERE username =  'ajaykumar'), (SELECT id FROM users WHERE username =  'vijaykumar'));