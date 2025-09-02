import { internalMutation } from "./_generated/server";

// This mutation will clear all data from your tables
export const clearAllData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all users
    const users = await ctx.db.query("users").collect();
    
    // Delete all users
    for (const user of users) {
      await ctx.db.delete(user._id);
    }
    
    // Get all workspace entries
    const workspaces = await ctx.db.query("workspace").collect();
    
    // Delete all workspace entries
    for (const workspace of workspaces) {
      await ctx.db.delete(workspace._id);
    }
  },
});
