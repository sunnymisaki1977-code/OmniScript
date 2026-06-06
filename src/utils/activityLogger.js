export const logActivity = async (actionMessage) => {
  try {
    const identityStr = localStorage.getItem('omni_identity');
    const identity = identityStr ? JSON.parse(identityStr) : { name: "訪客", role: "未定" };
    
    // Format: "[10:30] 角色 小明 建立了一個新專案"
    // The timestamp and formatting will be handled by the server to ensure consistency.
    
    await fetch('/api/notion/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: identity.name,
        role: identity.role || "",
        action: actionMessage,
      }),
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};
