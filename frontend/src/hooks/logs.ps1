    'weeklyTotals.3.runnerTipOuts': CastError: Cast to Number failed for value "NaN" (type number) at path "runnerTipOuts"
        at SchemaNumber.cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\number.js:380:11)
        at SchemaType.applySetters (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schemaType.js:1219:12)
        at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1416:22)
        at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1115:16)
        at EmbeddedDocument.Document (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:166:12)
        at EmbeddedDocument.Subdocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\subdocument.js:34:12)  
        at EmbeddedDocument.ArraySubdocument [as constructor] (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\arraySubdocument.js:44:15)
        at new EmbeddedDocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\documentArray.js:127:17)      
        at Proxy._cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\documentArray\methods\index.js:92:17)   
        at Proxy._mapCast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\array\methods\index.js:263:17) {     
      stringValue: '"NaN"',
      messageFormat: undefined,
      kind: 'Number',
      value: NaN,
      path: 'runnerTipOuts',
      reason: AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

        assert.ok(!isNaN(val))

          at castNumber (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\cast\number.js:27:10)
          at SchemaNumber.cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\number.js:378:12)
          at SchemaType.applySetters (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schemaType.js:1219:12)
          at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1416:22)
          at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1115:16)
          at EmbeddedDocument.Document (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:166:12)
          at EmbeddedDocument.Subdocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\subdocument.js:34:12)
          at EmbeddedDocument.ArraySubdocument [as constructor] (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\arraySubdocument.js:44:15)
          at new EmbeddedDocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\documentArray.js:127:17)    
          at Proxy._cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\documentArray\methods\index.js:92:17) {
        generatedMessage: true,
        code: 'ERR_ASSERTION',
        actual: false,
        expected: true,
        operator: '=='
      },
      valueType: 'number'
    },
    'weeklyTotals.3.hostTipOuts': CastError: Cast to Number failed for value "NaN" (type number) at path "hostTipOuts"
        at SchemaNumber.cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\number.js:380:11)
        at SchemaType.applySetters (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schemaType.js:1219:12)
        at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1416:22)
        at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1115:16)
        at EmbeddedDocument.Document (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:166:12)
        at EmbeddedDocument.Subdocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\subdocument.js:34:12)  
        at EmbeddedDocument.ArraySubdocument [as constructor] (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\arraySubdocument.js:44:15)
        at new EmbeddedDocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\documentArray.js:127:17)      
        at Proxy._cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\documentArray\methods\index.js:92:17)   
        at Proxy._mapCast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\array\methods\index.js:263:17) {     
      stringValue: '"NaN"',
      messageFormat: undefined,
      kind: 'Number',
      value: NaN,
      path: 'hostTipOuts',
      reason: AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

        assert.ok(!isNaN(val))

          at castNumber (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\cast\number.js:27:10)
          at SchemaNumber.cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\number.js:378:12)
          at SchemaType.applySetters (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schemaType.js:1219:12)
          at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1416:22)
          at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1115:16)
          at EmbeddedDocument.Document (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:166:12)
          at EmbeddedDocument.Subdocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\subdocument.js:34:12)
          at EmbeddedDocument.ArraySubdocument [as constructor] (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\arraySubdocument.js:44:15)
          at new EmbeddedDocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\documentArray.js:127:17)    
          at Proxy._cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\documentArray\methods\index.js:92:17) {
        generatedMessage: true,
        code: 'ERR_ASSERTION',
        actual: false,
        expected: true,
        operator: '=='
      },
      valueType: 'number'
    }
  },
  _message: 'TeamMember validation failed'
}
Error processing dailyTotals request: Error: TeamMember validation failed: weeklyTotals.3.barTipOuts: Cast to Number failed for value "NaN" (type number) at path "barTipOuts", weeklyTotals.3.runnerTipOuts: Cast to Number failed for value "NaN" (type number) at path "runnerTipOuts", weeklyTotals.3.hostTipOuts: Cast to Number failed for value "NaN" (type number) at path "hostTipOuts"
    at ValidationError.inspect (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\error\validation.js:50:26)
    at formatValue (node:internal/util/inspect:804:19)
    at inspect (node:internal/util/inspect:363:10)
    at formatWithOptionsInternal (node:internal/util/inspect:2297:40)
    at formatWithOptions (node:internal/util/inspect:2159:10)
    at console.value (node:internal/console/constructor:351:14)
    at console.warn (node:internal/console/constructor:384:61)
    at exports.createDailyTotal (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\controllers\TeamMembersController.js:194:11)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
  errors: {
    'weeklyTotals.3.barTipOuts': CastError: Cast to Number failed for value "NaN" (type number) at path "barTipOuts"
        at SchemaNumber.cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\number.js:380:11)
        at SchemaType.applySetters (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schemaType.js:1219:12)
        at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1416:22)
        at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1115:16)
        at EmbeddedDocument.Document (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:166:12)
        at EmbeddedDocument.Subdocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\subdocument.js:34:12)  
        at EmbeddedDocument.ArraySubdocument [as constructor] (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\arraySubdocument.js:44:15)
        at new EmbeddedDocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\documentArray.js:127:17)      
        at Proxy._cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\documentArray\methods\index.js:92:17)   
        at Proxy._mapCast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\array\methods\index.js:263:17) {     
      stringValue: '"NaN"',
      messageFormat: undefined,
      kind: 'Number',
      value: NaN,
      path: 'barTipOuts',
      reason: AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

        assert.ok(!isNaN(val))

          at castNumber (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\cast\number.js:27:10)
          at SchemaNumber.cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\number.js:378:12)
          at SchemaType.applySetters (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schemaType.js:1219:12)
          at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1416:22)
          at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1115:16)
          at EmbeddedDocument.Document (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:166:12)
          at EmbeddedDocument.Subdocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\subdocument.js:34:12)
          at EmbeddedDocument.ArraySubdocument [as constructor] (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\arraySubdocument.js:44:15)
          at new EmbeddedDocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\documentArray.js:127:17)    
          at Proxy._cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\documentArray\methods\index.js:92:17) {
        generatedMessage: true,
        code: 'ERR_ASSERTION',
        actual: false,
        expected: true,
        operator: '=='
      },
      valueType: 'number'
    },
    'weeklyTotals.3.runnerTipOuts': CastError: Cast to Number failed for value "NaN" (type number) at path "runnerTipOuts"
        at SchemaNumber.cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\number.js:380:11)
        at SchemaType.applySetters (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schemaType.js:1219:12)
        at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1416:22)
        at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1115:16)
        at EmbeddedDocument.Document (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:166:12)
        at EmbeddedDocument.Subdocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\subdocument.js:34:12)  
        at EmbeddedDocument.ArraySubdocument [as constructor] (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\arraySubdocument.js:44:15)
        at new EmbeddedDocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\documentArray.js:127:17)      
        at Proxy._cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\documentArray\methods\index.js:92:17)   
        at Proxy._mapCast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\array\methods\index.js:263:17) {     
      stringValue: '"NaN"',
      messageFormat: undefined,
      kind: 'Number',
      value: NaN,
      path: 'runnerTipOuts',
      reason: AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

        assert.ok(!isNaN(val))

          at castNumber (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\cast\number.js:27:10)
          at SchemaNumber.cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\number.js:378:12)
          at SchemaType.applySetters (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schemaType.js:1219:12)
          at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1416:22)
          at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1115:16)
          at EmbeddedDocument.Document (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:166:12)
          at EmbeddedDocument.Subdocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\subdocument.js:34:12)
          at EmbeddedDocument.ArraySubdocument [as constructor] (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\arraySubdocument.js:44:15)
          at new EmbeddedDocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\documentArray.js:127:17)    
          at Proxy._cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\documentArray\methods\index.js:92:17) {
        generatedMessage: true,
        code: 'ERR_ASSERTION',
        actual: false,
        expected: true,
        operator: '=='
      },
      valueType: 'number'
    },
    'weeklyTotals.3.hostTipOuts': CastError: Cast to Number failed for value "NaN" (type number) at path "hostTipOuts"
        at SchemaNumber.cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\number.js:380:11)
        at SchemaType.applySetters (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schemaType.js:1219:12)
        at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1416:22)
        at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1115:16)
        at EmbeddedDocument.Document (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:166:12)
        at EmbeddedDocument.Subdocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\subdocument.js:34:12)  
        at EmbeddedDocument.ArraySubdocument [as constructor] (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\arraySubdocument.js:44:15)
        at new EmbeddedDocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\documentArray.js:127:17)      
        at Proxy._cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\documentArray\methods\index.js:92:17)   
        at Proxy._mapCast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\array\methods\index.js:263:17) {     
      stringValue: '"NaN"',
      messageFormat: undefined,
      kind: 'Number',
      value: NaN,
      path: 'hostTipOuts',
      reason: AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

        assert.ok(!isNaN(val))

          at castNumber (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\cast\number.js:27:10)
          at SchemaNumber.cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\number.js:378:12)
          at SchemaType.applySetters (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schemaType.js:1219:12)
          at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1416:22)
          at EmbeddedDocument.$set (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:1115:16)
          at EmbeddedDocument.Document (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\document.js:166:12)
          at EmbeddedDocument.Subdocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\subdocument.js:34:12)
          at EmbeddedDocument.ArraySubdocument [as constructor] (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\arraySubdocument.js:44:15)
          at new EmbeddedDocument (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\schema\documentArray.js:127:17)    
          at Proxy._cast (C:\Users\findt\Desktop\Coding\React\Tip-Tracker\backend\node_modules\mongoose\lib\types\documentArray\methods\index.js:92:17) {
        generatedMessage: true,
        code: 'ERR_ASSERTION',
        actual: false,
        expected: true,
        operator: '=='
      },
      valueType: 'number'
    }
  },
  _message: 'TeamMember validation failed'
}






415 hidden
🚀 ~ file: tipOuts.js:14 ~ CalculateTipOuts ~ selectedTeamMember: 
Object { _id: "658736aa648113c0f24147fd", teamMemberName: "Sarah", position: "server", timeZone: "UTC", dailyTotals: (2) […], weeklyTotals: (2) […], __v: 2 }
tipOuts.js:15
🚀 ~ file: tipOuts.js:14 ~ CalculateTipOuts ~ dailyTotals: 
Object { date: "2023-12-19", foodSales: 4563, barSales: 21, nonCashTips: 213, cashTips: 312, barTipOuts: 0, runnerTipOuts: 0, hostTipOuts: 0, totalTipOut: 0, tipsReceived: 0, … }
tipOuts.js:16
🚀 ~ file: tipOuts.js:14 ~ CalculateTipOuts ~ team: 
Array(4) [ {…}, {…}, {…}, {…} ]
tipOuts.js:17
🚀 ~ file: tipOuts.js:35 ~ CalculateTipOuts ~ workedSameDate: false 4 tipOuts.js:35
🚀 ~ file: tipOuts.js:55 ~ CalculateTipOuts ~ tipOuts: 
Object { bartender: 1.05, host: 68.445, runner: 182.52, server: 0 }
tipOuts.js:53
🚀 ~ file: tipOuts.js:14 ~ CalculateTipOuts ~ selectedTeamMember: 
Object { _id: "65874e457b8b4faaf34ccaf5", teamMemberName: "Mike", position: "bartender", timeZone: "UTC", dailyTotals: (1) […], weeklyTotals: (2) […], __v: 1 }
tipOuts.js:15
🚀 ~ file: tipOuts.js:14 ~ CalculateTipOuts ~ dailyTotals: 
Object { date: "2023-12-18", foodSales: 123, barSales: 123, nonCashTips: 1231, cashTips: 23, barTipOuts: 0, runnerTipOuts: 0, hostTipOuts: 0, totalTipOut: 0, tipsReceived: 0, … }
tipOuts.js:16
🚀 ~ file: tipOuts.js:14 ~ CalculateTipOuts ~ team: 
Array(4) [ {…}, {…}, {…}, {…} ]
tipOuts.js:17
🚀 ~ file: tipOuts.js:55 ~ CalculateTipOuts ~ tipOuts: 
Object { bartender: 0, host: 0, runner: 0, server: 0 }
tipOuts.js:53
🚀 ~ file: tipOuts.js:14 ~ CalculateTipOuts ~ selectedTeamMember: 
Object { _id: "658736aa648113c0f24147fd", teamMemberName: "Sarah", position: "server", timeZone: "UTC", dailyTotals: (2) […], weeklyTotals: (2) […], __v: 2 }
tipOuts.js:15
🚀 ~ file: tipOuts.js:14 ~ CalculateTipOuts ~ dailyTotals: 
Object { date: "2023-12-18", foodSales: 12313, barSales: 452, nonCashTips: 23, cashTips: 123, barTipOuts: 0, runnerTipOuts: 0, hostTipOuts: 0, totalTipOut: 0, tipsReceived: 0, … }
tipOuts.js:16
🚀 ~ file: tipOuts.js:14 ~ CalculateTipOuts ~ team: 
Array(4) [ {…}, {…}, {…}, {…} ]
tipOuts.js:17
🚀 ~ file: tipOuts.js:35 ~ CalculateTipOuts ~ workedSameDate: false 2 tipOuts.js:35
🚀 ~ file: tipOuts.js:35 ~ CalculateTipOuts ~ workedSameDate: true tipOuts.js:35
🚀 ~ file: tipOuts.js:35 ~ CalculateTipOuts ~ workedSameDate: false tipOuts.js:35
🚀 ~ file: tipOuts.js:55 ~ CalculateTipOuts ~ tipOuts: 
Object { bartender: 22.6, host: 184.695, runner: 492.52000000000004, server: 0 }
​
bartender: 22.6
​
host: 184.695
​
runner: 492.52000000000004
​
server: 0
​
<prototype>: Object { … }
tipOuts.js:53
🚀 ~ file: tipOuts.js:14 ~ CalculateTipOuts ~ selectedTeamMember: 
Object { _id: "65874e457b8b4faaf34ccaf5", teamMemberName: "Mike", position: "bartender", timeZone: "UTC", dailyTotals: (2) […], weeklyTotals: (3) […], __v: 2 }
tipOuts.js:15
🚀 ~ file: tipOuts.js:14 ~ CalculateTipOuts ~ dailyTotals: 
Object { date: "2023-12-19", foodSales: 123, barSales: 231, nonCashTips: 321, cashTips: 23, barTipOuts: 0, runnerTipOuts: 0, hostTipOuts: 0, totalTipOut: 0, tipsReceived: 0, … }
tipOuts.js:16
🚀 ~ file: tipOuts.js:14 ~ CalculateTipOuts ~ team: 
Array(4) [ {…}, {…}, {…}, {…} ]
tipOuts.js:17
🚀 ~ file: tipOuts.js:55 ~ CalculateTipOuts ~ tipOuts: 
Object { bartender: 0, host: 0, runner: 0, server: 0 }