CREATE OR REPLACE VIEW tasks_summary AS
SELECT 
    t.id,
    t.text,
    t.due_date,
    t.type,
    t.contact_id,
    t.sales_id,
    t.created_at,
    t.deal_id,
    t.note,
    t.completed,
    d.name AS deal_name,
    d.project_type AS deal_project_type,
    d.stage AS deal_stage
FROM 
    tasks t
LEFT JOIN 
    deals d ON t.deal_id = d.id;

-- Ensure that authenticated users can select from this view
GRANT SELECT ON tasks_summary TO authenticated;
