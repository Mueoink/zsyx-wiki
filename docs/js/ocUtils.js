
// 等级数字到稀有度字符的映射
export const levelMap = {
  1: "D",
  2: "C",
  3: "B",
  4: "A",
  5: "S",
  6: "SS",
  7: "SSS",
  8: "SP",
};

// 稀有度字符到等级数字的映射
export const rarityMap = Object.fromEntries(
  Object.entries(levelMap).map(([key, value]) => [value, parseInt(key)])
);

/**
 * 根据稀有度标签获取对应的CSS类名
 * @param {string} rarityLabel - 稀有度标签, e.g., 'S', 'A', 'C'
 * @returns {string} - CSS类名, e.g., 'level-5'
 */
export const getRarityClass = (rarityLabel) => {
  return `level-${rarityMap[rarityLabel] || 0}`;
};

/**
 * 计算居中显示的属性条的样式
 * @param {number} value - 属性值 (可以是正数或负数)
 * @param {number} [max=10] - 该属性的最大绝对值
 * @returns {object} - 一个包含 width, left/right 的样式对象
 */
export const getCenteredAttributeBarStyle = (value, max = 10) => {
  // 确保值在 [-max, max] 区间内
  const safeValue = Math.max(-max, Math.min(max, value));

  // 计算条的宽度百分比（相对于半个容器）
  const percentage = (Math.abs(safeValue) / max) * 50;

  const style = {
    width: `${percentage}%`,
  };

  // 如果是正数，条从中心向右延伸；如果是负数，从中心向左延伸
  if (safeValue >= 0) {
    style.left = "50%";
  } else {
    style.right = "50%";
  }

  return style;
};

/**
 * 获取属性条末端圆角的CSS类名
 * @param {number} value - 属性值
 * @returns {string} - 'end-cap-right', 'end-cap-left', or ''
 */
export const getBarEndCapClass = (value) => {
  if (value === 0) return "";
  return value > 0 ? "end-cap-right" : "end-cap-left";
};
