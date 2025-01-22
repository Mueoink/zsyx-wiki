"use strict";(self.webpackChunkzsys_wiki=self.webpackChunkzsys_wiki||[]).push([[35],{3296:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>l,contentTitle:()=>c,default:()=>o,frontMatter:()=>i,metadata:()=>s,toc:()=>t});const s=JSON.parse('{"id":"something/puke/\u670d\u52a1\u7aefAPI","title":"\u670d\u52a1\u7aefAPI","description":"\u672c\u90e8\u5206\u4e0d\u9002\u5408\u65e0\u5f00\u53d1\u7ecf\u9a8c\u7684\u5c0f\u767d\u9605\u8bfb","source":"@site/docs/something/puke/\u670d\u52a1\u7aef.md","sourceDirName":"something/puke","slug":"/something/puke/\u670d\u52a1\u7aefAPI","permalink":"/something/puke/\u670d\u52a1\u7aefAPI","draft":false,"unlisted":false,"editUrl":"https://github.com/Mueoink/zsyx-wiki/tree/main/docs/something/puke/\u670d\u52a1\u7aef.md","tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3,"id":"\u670d\u52a1\u7aefAPI"},"sidebar":"tutorialSidebar","previous":{"title":"\u4f53\u7cfb\u8be6\u60c5","permalink":"/something/puke/\u4f53\u7cfb\u8be6\u60c5"}}');var a=n(4848),d=n(8453);const i={sidebar_position:3,id:"\u670d\u52a1\u7aefAPI"},c="\u670d\u52a1\u7aefAPI",l={},t=[{value:"\u642d\u5efa\u8ba1\u7b97API",id:"\u642d\u5efa\u8ba1\u7b97api",level:2},{value:"\u5982\u4f55\u4f7f\u7528",id:"\u5982\u4f55\u4f7f\u7528",level:2},{value:"\u4f24\u5bb3\u8ba1\u7b97API\u53c2\u6570",id:"\u4f24\u5bb3\u8ba1\u7b97api\u53c2\u6570",level:3},{value:"\u793a\u4f8b\u8bf7\u6c42\u4f53",id:"\u793a\u4f8b\u8bf7\u6c42\u4f53",level:3},{value:"\u8fd4\u56de\u793a\u4f8b",id:"\u8fd4\u56de\u793a\u4f8b",level:3},{value:"\u6cbb\u7597\u8ba1\u7b97API\u53c2\u6570",id:"\u6cbb\u7597\u8ba1\u7b97api\u53c2\u6570",level:3},{value:"\u793a\u4f8b\u8bf7\u6c42\u4f53",id:"\u793a\u4f8b\u8bf7\u6c42\u4f53-1",level:3},{value:"\u8fd4\u56de\u793a\u4f8b",id:"\u8fd4\u56de\u793a\u4f8b-1",level:3}];function h(e){const r={admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,d.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(r.header,{children:(0,a.jsx)(r.h1,{id:"\u670d\u52a1\u7aefapi",children:"\u670d\u52a1\u7aefAPI"})}),"\n",(0,a.jsx)(r.admonition,{type:"danger",children:(0,a.jsx)(r.p,{children:(0,a.jsx)(r.strong,{children:"\u672c\u90e8\u5206\u4e0d\u9002\u5408\u65e0\u5f00\u53d1\u7ecf\u9a8c\u7684\u5c0f\u767d\u9605\u8bfb"})})}),"\n",(0,a.jsx)(r.p,{children:"\u63d0\u4f9b\u4e86\u4e00\u4e2a\u7b80\u6613\u7684\u670d\u52a1\u7aef\u4ee3\u7801\uff0c\u4f9b\u8ba1\u7b97\u4f24\u5bb3\u548c\u6cbb\u7597\u91cf"}),"\n",(0,a.jsx)(r.h2,{id:"\u642d\u5efa\u8ba1\u7b97api",children:"\u642d\u5efa\u8ba1\u7b97API"}),"\n",(0,a.jsx)(r.p,{children:"\u672c\u90e8\u5206\u53ea\u63d0\u4f9b\u793a\u4f8b\uff0c\u6211\u8fd9\u91cc\u4f7f\u7528node.js\u7f16\u5199"}),"\n",(0,a.jsxs)(r.p,{children:["\u521b\u5efa ",(0,a.jsx)(r.code,{children:"server.js"})," \u6587\u4ef6 \uff0c\u5e76\u5199\u5165\u4ee5\u4e0b\u5185\u5bb9"]}),"\n",(0,a.jsx)(r.pre,{children:(0,a.jsx)(r.code,{className:"language-js",children:'const express = require("express");\r\nconst bodyParser = require("body-parser");\r\n\r\nconst app = express();\r\nconst port = 11451; // \u81ea\u5df1\u8bbe\u5b9a\u4f60\u7684\u7aef\u53e3\r\nconst ip = `127.0.0.1`; // \u81ea\u5df1\u7684IP\r\n\r\n// \u6bcf\u6b21\u90fd\u751f\u6210\u4e00\u4e2a20\u4f4d\u7684\u968f\u673a\u5bc6\u7801\r\nconst generateRandomPassword = () => {\r\n  const chars =\r\n    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; \r\n  let password = "";\r\n  for (let i = 0; i < 20; i++) {\r\n    password += chars.charAt(Math.floor(Math.random() * chars.length)); \r\n  }\r\n  return password;\r\n};\r\n\r\nconst apiPassword = generateRandomPassword();\r\nconsole.log(`\u672c\u6b21 API \u5bc6\u7801\u4e3a:${apiPassword}`);\r\n\r\napp.use(bodyParser.json());\r\n\r\nclass DamageCalculator {\r\n  constructor(\r\n    baseDamage,\r\n    damageIncreases = [],\r\n    damageDecreases = [],\r\n    fixedDamageIncrease = 0\r\n  ) {\r\n    this.baseDamage = baseDamage;\r\n    this.damageIncreases = damageIncreases;\r\n    this.damageDecreases = damageDecreases;\r\n    this.fixedDamageIncrease = fixedDamageIncrease;\r\n  }\r\n\r\n  applyDamage() {\r\n    let totalDamage = this.baseDamage;\r\n\r\n    this.damageIncreases.forEach((increase) => {\r\n      totalDamage *= 1 + increase;\r\n    });\r\n    totalDamage += this.fixedDamageIncrease;\r\n    this.damageDecreases.forEach((decrease) => {\r\n      totalDamage *= 1 - decrease;\r\n    });\r\n\r\n    return totalDamage;\r\n  }\r\n}\r\n\r\nclass HealingCalculator {\r\n  constructor(baseHealing, healingIncreases = [], healingDecreases = []) {\r\n    this.baseHealing = baseHealing;\r\n    this.healingIncreases = healingIncreases;\r\n    this.healingDecreases = healingDecreases;\r\n  }\r\n\r\n  applyHealing() {\r\n    let totalHealing = this.baseHealing;\r\n\r\n    this.healingIncreases.forEach((increase) => {\r\n      totalHealing *= 1 + increase;\r\n    });\r\n\r\n    this.healingDecreases.forEach((decrease) => {\r\n      totalHealing *= 1 - decrease;\r\n    });\r\n\r\n    return totalHealing;\r\n  }\r\n}\r\n\r\n// \u4f24\u5bb3 API\r\napp.post("/damage",(req, res) => {\r\n  try {\r\n    const {\r\n      password = ``,\r\n      baseDamage,\r\n      damageIncreases = [],\r\n      damageDecreases = [],\r\n      fixedDamageIncrease = 0,\r\n    } = req.body;\r\n    if (password.trim().toString() !== apiPassword.trim().toString()) {\r\n      return res\r\n        .status(403)\r\n        .json({\r\n          error: `\u65e0\u6548\u7684API\u5bc6\u7801\uff0c\u5bc6\u7801\u4e3a${apiPassword}\uff0c\u4f60\u7684\u5bc6\u7801\u662f${password}`,\r\n        });\r\n    }\r\n\r\n    const damageCalculator = new DamageCalculator(\r\n      baseDamage,\r\n      damageIncreases,\r\n      damageDecreases,\r\n      fixedDamageIncrease\r\n    );\r\n\r\n    const finalDamage = damageCalculator.applyDamage();\r\n\r\n    res.json({ finalDamage });\r\n  } catch (error) {\r\n    console.error(error);\r\n    res.status(400).json({ error: "\u65e0\u6548\u8f93\u5165\u6216\u8ba1\u7b97\u9519\u8bef" });\r\n  }\r\n});\r\n\r\n// \u6cbb\u7597 API\r\napp.post("/healing", (req, res) => {\r\n  try {\r\n    const {\r\n      password = \'\',\r\n      baseHealing,\r\n      healingIncreases = [],\r\n      healingDecreases = [],\r\n    } = req.body;\r\n    // \u9a8c\u8bc1\u5bc6\u7801\r\n    if (password.trim().toString() !== apiPassword.trim().toString()) {\r\n      return res.status(403).json({ error: "\u65e0\u6548\u7684API\u5bc6\u7801" });\r\n    }\r\n    const healingCalculator = new HealingCalculator(\r\n      baseHealing,\r\n      healingIncreases,\r\n      healingDecreases\r\n    );\r\n\r\n    const finalHealing = healingCalculator.applyHealing();\r\n\r\n    res.json({ finalHealing });\r\n  } catch (error) {\r\n    console.error(error);\r\n    res.status(400).json({ error: "\u65e0\u6548\u8f93\u5165\u6216\u8ba1\u7b97\u9519\u8bef" });\r\n  }\r\n});\r\n\r\n// \u542f\u52a8\r\napp.listen(port, ip, () => {\r\n  console.log(`Server is running on http://${ip}:${port}`);\r\n  console.log(`\u672c\u6b21 API \u5bc6\u7801:${apiPassword}`);\r\n});\r\n\n'})}),"\n",(0,a.jsx)(r.h2,{id:"\u5982\u4f55\u4f7f\u7528",children:"\u5982\u4f55\u4f7f\u7528"}),"\n",(0,a.jsx)(r.admonition,{type:"info",children:(0,a.jsxs)(r.p,{children:[(0,a.jsx)(r.strong,{children:"\u63a5\u53e3\u8bf4\u660e"})," \u4ec5\u9650\u4e8e \u4e0a\u8ff0\u63d0\u4f9b\u7684\u4ee3\u7801\uff0c\u5982\u81ea\u884c\u8bbe\u8ba1\uff0c\u8bf7\u5ffd\u89c6\u4e0b\u65b9\u5185\u5bb9"]})}),"\n",(0,a.jsxs)(r.p,{children:["\u786e\u4fdd\u4f60\u7684\u7535\u8111\u5df2\u7ecf\u5b89\u88c5\u4e86",(0,a.jsx)(r.code,{children:"node.js"})]}),"\n",(0,a.jsxs)(r.p,{children:["\u5728",(0,a.jsx)(r.code,{children:"server.js"}),"\u6240\u5728\u6587\u4ef6\u5939\uff0c\u8fd0\u884c"]}),"\n",(0,a.jsx)(r.pre,{children:(0,a.jsx)(r.code,{children:"node server.js\n"})}),"\n",(0,a.jsx)(r.p,{children:"\u51fa\u73b0\u7c7b\u4f3c\u4ee5\u4e0b\u5185\u5bb9\uff0c\u5373\u4e3a\u542f\u52a8\u6210\u529f"}),"\n",(0,a.jsx)(r.pre,{children:(0,a.jsx)(r.code,{children:"Server is running on http://localhost:11451\r\n\u672c\u6b21 API \u5bc6\u7801\u4e3a:S9AzXtOgGjDJV14gdWxW\n"})}),"\n",(0,a.jsx)(r.p,{children:"\u968f\u540e\u6309\u7167\u8bf7\u6c42\u53c2\u6570\u548c\u7aef\u53e3\u8fdb\u884c\u4ea4\u4e92"}),"\n",(0,a.jsxs)(r.p,{children:["\u4f60\u53ef\u4ee5\u5c06\u5176\u90e8\u7f72\u5728\u4f60\u7684\u670d\u52a1\u5668\u4e0a\uff0c\u5e76\u5c06IP\u90e8\u5206\u6539\u4e3a ",(0,a.jsx)(r.code,{children:"0.0.0.0"})]}),"\n",(0,a.jsxs)(r.p,{children:["\u8fd9\u6837\u53ef\u4ee5\u901a\u8fc7",(0,a.jsx)(r.code,{children:"POST"})," \u8bf7\u6c42 ",(0,a.jsx)(r.code,{children:"example.url/<api>"})," \u6765\u83b7\u53d6\u7ed3\u679c"]}),"\n",(0,a.jsxs)(r.p,{children:[(0,a.jsx)(r.code,{children:"<api>"})," \u63a5\u53e3\u5982\u4e0b:"]}),"\n",(0,a.jsx)(r.h3,{id:"\u4f24\u5bb3\u8ba1\u7b97api\u53c2\u6570",children:"\u4f24\u5bb3\u8ba1\u7b97API\u53c2\u6570"}),"\n",(0,a.jsxs)(r.p,{children:["\u5bf9\u4e8e\u4f24\u5bb3\u8ba1\u7b97API\uff0c\u63d0\u4f9b\u4e86",(0,a.jsx)(r.code,{children:"damage"}),"\u63a5\u53e3 ,\u4f7f\u7528",(0,a.jsx)(r.code,{children:"POST"})," \u83b7\u53d6"]}),"\n",(0,a.jsxs)(r.table,{children:[(0,a.jsx)(r.thead,{children:(0,a.jsxs)(r.tr,{children:[(0,a.jsx)(r.th,{children:"\u53c2\u6570\u540d"}),(0,a.jsx)(r.th,{children:"\u7c7b\u578b"}),(0,a.jsx)(r.th,{children:"\u662f\u5426\u5fc5\u586b"}),(0,a.jsx)(r.th,{children:"\u9ed8\u8ba4\u503c"}),(0,a.jsx)(r.th,{children:"\u8bf4\u660e"})]})}),(0,a.jsxs)(r.tbody,{children:[(0,a.jsxs)(r.tr,{children:[(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"password"})}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"string"})}),(0,a.jsx)(r.td,{children:"\u662f"}),(0,a.jsx)(r.td,{children:"\u65e0"}),(0,a.jsx)(r.td,{children:"API \u5bc6\u7801\uff0c\u7528\u4e8e\u8eab\u4efd\u9a8c\u8bc1\uff0c\u5fc5\u987b\u6b63\u786e\u624d\u80fd\u7ee7\u7eed\u8ba1\u7b97"})]}),(0,a.jsxs)(r.tr,{children:[(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"baseDamage"})}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"number"})}),(0,a.jsx)(r.td,{children:"\u662f"}),(0,a.jsx)(r.td,{children:"\u65e0"}),(0,a.jsx)(r.td,{children:"\u57fa\u7840\u4f24\u5bb3\u503c\uff0c\u5fc5\u987b\u63d0\u4f9b"})]}),(0,a.jsxs)(r.tr,{children:[(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"damageIncreases"})}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"array of number"})}),(0,a.jsx)(r.td,{children:"\u5426"}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"[]"})}),(0,a.jsxs)(r.td,{children:["\u589e\u52a0\u7684\u4f24\u5bb3\u767e\u5206\u6bd4\u6570\u7ec4\uff0c\u4f8b\u5982 ",(0,a.jsx)(r.code,{children:"[0.2, 0.1]"})]})]}),(0,a.jsxs)(r.tr,{children:[(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"damageDecreases"})}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"array of number"})}),(0,a.jsx)(r.td,{children:"\u5426"}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"[]"})}),(0,a.jsxs)(r.td,{children:["\u51cf\u5c11\u7684\u4f24\u5bb3\u767e\u5206\u6bd4\u6570\u7ec4\uff0c\u4f8b\u5982 ",(0,a.jsx)(r.code,{children:"[0.3]"})]})]}),(0,a.jsxs)(r.tr,{children:[(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"fixedDamageIncrease"})}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"number"})}),(0,a.jsx)(r.td,{children:"\u5426"}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"0"})}),(0,a.jsxs)(r.td,{children:["\u56fa\u5b9a\u4f24\u5bb3\u589e\u52a0\u503c\uff0c\u4f8b\u5982 ",(0,a.jsx)(r.code,{children:"50"})]})]})]})]}),"\n",(0,a.jsx)(r.h3,{id:"\u793a\u4f8b\u8bf7\u6c42\u4f53",children:"\u793a\u4f8b\u8bf7\u6c42\u4f53"}),"\n",(0,a.jsx)(r.pre,{children:(0,a.jsx)(r.code,{className:"language-json",children:'{\r\n  "password": "dtr1qhIrAnOe731dgfGp",\r\n  "baseDamage": 1000,\r\n  "damageIncreases": [0.2, 0.1],\r\n  "damageDecreases": [0.3],\r\n  "fixedDamageIncrease": 50\r\n}\n'})}),"\n",(0,a.jsx)(r.h3,{id:"\u8fd4\u56de\u793a\u4f8b",children:"\u8fd4\u56de\u793a\u4f8b"}),"\n",(0,a.jsx)(r.pre,{children:(0,a.jsx)(r.code,{className:"language-json",children:'{\r\n  "finalDamage": 850\r\n}\n'})}),"\n",(0,a.jsx)(r.h3,{id:"\u6cbb\u7597\u8ba1\u7b97api\u53c2\u6570",children:"\u6cbb\u7597\u8ba1\u7b97API\u53c2\u6570"}),"\n",(0,a.jsxs)(r.p,{children:["\u5bf9\u4e8e\u4f24\u5bb3\u8ba1\u7b97API\uff0c\u63d0\u4f9b\u4e86",(0,a.jsx)(r.code,{children:"healing"}),"\u63a5\u53e3 ,\u4f7f\u7528",(0,a.jsx)(r.code,{children:"POST"})," \u83b7\u53d6"]}),"\n",(0,a.jsxs)(r.table,{children:[(0,a.jsx)(r.thead,{children:(0,a.jsxs)(r.tr,{children:[(0,a.jsx)(r.th,{children:"\u53c2\u6570\u540d"}),(0,a.jsx)(r.th,{children:"\u7c7b\u578b"}),(0,a.jsx)(r.th,{children:"\u662f\u5426\u5fc5\u586b"}),(0,a.jsx)(r.th,{children:"\u9ed8\u8ba4\u503c"}),(0,a.jsx)(r.th,{children:"\u8bf4\u660e"})]})}),(0,a.jsxs)(r.tbody,{children:[(0,a.jsxs)(r.tr,{children:[(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"password"})}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"string"})}),(0,a.jsx)(r.td,{children:"\u662f"}),(0,a.jsx)(r.td,{children:"\u65e0"}),(0,a.jsx)(r.td,{children:"API \u5bc6\u7801\uff0c\u7528\u4e8e\u8eab\u4efd\u9a8c\u8bc1\uff0c\u5fc5\u987b\u6b63\u786e\u624d\u80fd\u7ee7\u7eed\u8ba1\u7b97"})]}),(0,a.jsxs)(r.tr,{children:[(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"baseHealing"})}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"number"})}),(0,a.jsx)(r.td,{children:"\u662f"}),(0,a.jsx)(r.td,{children:"\u65e0"}),(0,a.jsx)(r.td,{children:"\u57fa\u7840\u6cbb\u7597\u503c\uff0c\u5fc5\u987b\u63d0\u4f9b"})]}),(0,a.jsxs)(r.tr,{children:[(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"healingIncreases"})}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"array of number"})}),(0,a.jsx)(r.td,{children:"\u5426"}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"[]"})}),(0,a.jsxs)(r.td,{children:["\u589e\u52a0\u7684\u6cbb\u7597\u767e\u5206\u6bd4\u6570\u7ec4\uff0c\u4f8b\u5982 ",(0,a.jsx)(r.code,{children:"[0.1, 0.05]"})]})]}),(0,a.jsxs)(r.tr,{children:[(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"healingDecreases"})}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"array of number"})}),(0,a.jsx)(r.td,{children:"\u5426"}),(0,a.jsx)(r.td,{children:(0,a.jsx)(r.code,{children:"[]"})}),(0,a.jsxs)(r.td,{children:["\u51cf\u5c11\u7684\u6cbb\u7597\u767e\u5206\u6bd4\u6570\u7ec4\uff0c\u4f8b\u5982 ",(0,a.jsx)(r.code,{children:"[0.2]"})]})]})]})]}),"\n",(0,a.jsx)(r.h3,{id:"\u793a\u4f8b\u8bf7\u6c42\u4f53-1",children:"\u793a\u4f8b\u8bf7\u6c42\u4f53"}),"\n",(0,a.jsx)(r.pre,{children:(0,a.jsx)(r.code,{className:"language-json",children:'{\r\n  "password": "dtr1qhIrAnOe731dgfGp",\r\n  "baseHealing": 500,\r\n  "healingIncreases": [0.1, 0.05],\r\n  "healingDecreases": [0.2]\r\n}\n'})}),"\n",(0,a.jsx)(r.h3,{id:"\u8fd4\u56de\u793a\u4f8b-1",children:"\u8fd4\u56de\u793a\u4f8b"}),"\n",(0,a.jsx)(r.pre,{children:(0,a.jsx)(r.code,{className:"language-json",children:'{\r\n  "finalHealing": 380\r\n}\n'})})]})}function o(e={}){const{wrapper:r}={...(0,d.R)(),...e.components};return r?(0,a.jsx)(r,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},8453:(e,r,n)=>{n.d(r,{R:()=>i,x:()=>c});var s=n(6540);const a={},d=s.createContext(a);function i(e){const r=s.useContext(d);return s.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function c(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),s.createElement(d.Provider,{value:r},e.children)}}}]);