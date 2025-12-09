import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

export const designBudgetTool = {
  name: 'design_budget',
  description: 'Design a comprehensive project budget from meeting data. Automatically processes the meeting and creates a detailed budget with people costs and resource costs.',
  inputSchema: {
    type: 'object',
    properties: {
      meetingId: {
        type: 'string',
        description: 'The MongoDB _id of the meeting to design budget for',
      },
    },
    required: ['meetingId'],
  },
};

export async function handleDesignBudget(request: typeof CallToolRequestSchema._type): Promise<any> {
  const { meetingId } = request.params.arguments as { meetingId: string };

  if (!meetingId) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: 'meetingId is required',
          }),
        },
      ],
      isError: true,
    };
  }

  try {
    // Call backend API to design budget
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const response = await fetch(`${backendUrl}/api/budgets/design/${meetingId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to design budget');
    }

    const result = await response.json();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            data: {
              budgetId: result.data._id,
              project_name: result.data.project_name,
              total_budget: result.data.total_budget,
              people_costs: result.data.people_costs,
              resource_costs: result.data.resource_costs,
            },
          }),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }),
        },
      ],
      isError: true,
    };
  }
}

