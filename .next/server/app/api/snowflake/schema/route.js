/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/snowflake/schema/route";
exports.ids = ["app/api/snowflake/schema/route"];
exports.modules = {

/***/ "(rsc)/./app/api/snowflake/schema/route.ts":
/*!*******************************************!*\
  !*** ./app/api/snowflake/schema/route.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _app_lib_snowflake__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/app/lib/snowflake */ \"(rsc)/./app/lib/snowflake.ts\");\n\n\nasync function POST(req) {\n    try {\n        console.log('Received schema request');\n        let body;\n        try {\n            body = await req.json();\n        } catch (error) {\n            console.error('Failed to parse request body:', error);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid JSON in request body'\n            }, {\n                status: 400\n            });\n        }\n        console.log('Request body:', {\n            account: body?.account,\n            username: body?.username,\n            hasPassword: !!body?.password,\n            warehouse: body?.warehouse,\n            database: body?.database,\n            schema: body?.schema,\n            role: body?.role\n        });\n        // Validate connection\n        if (!body) {\n            console.log('No body provided');\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Connection information is required'\n            }, {\n                status: 400\n            });\n        }\n        const { account, username, password, warehouse, database } = body;\n        if (!account) {\n            console.log('Missing account parameter');\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Account is required'\n            }, {\n                status: 400\n            });\n        }\n        if (!username) {\n            console.log('Missing username parameter');\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Username is required'\n            }, {\n                status: 400\n            });\n        }\n        if (!password) {\n            console.log('Missing password parameter');\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Password is required'\n            }, {\n                status: 400\n            });\n        }\n        if (!warehouse) {\n            console.log('Missing warehouse parameter');\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Warehouse is required'\n            }, {\n                status: 400\n            });\n        }\n        if (!database) {\n            console.log('Missing database parameter');\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Database is required'\n            }, {\n                status: 400\n            });\n        }\n        // Establish connection\n        console.log('Attempting to establish connection to Snowflake');\n        const conn = await (0,_app_lib_snowflake__WEBPACK_IMPORTED_MODULE_1__.getConnection)({\n            account,\n            username,\n            password,\n            warehouse,\n            database,\n            schema: body.schema || 'PUBLIC',\n            role: body.role\n        });\n        console.log('Connection established successfully');\n        // Get schema information\n        console.log('Fetching schema information');\n        const schema = await (0,_app_lib_snowflake__WEBPACK_IMPORTED_MODULE_1__.getDatabaseSchema)(conn);\n        console.log('Schema fetched successfully');\n        // Return response\n        console.log('Returning schema response');\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(schema);\n    } catch (error) {\n        console.error('Error fetching schema:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message || 'Failed to fetch schema'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3Nub3dmbGFrZS9zY2hlbWEvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXdEO0FBQ2U7QUFFaEUsZUFBZUcsS0FBS0MsR0FBZ0I7SUFDekMsSUFBSTtRQUNGQyxRQUFRQyxHQUFHLENBQUM7UUFFWixJQUFJQztRQUNKLElBQUk7WUFDRkEsT0FBTyxNQUFNSCxJQUFJSSxJQUFJO1FBQ3ZCLEVBQUUsT0FBT0MsT0FBTztZQUNkSixRQUFRSSxLQUFLLENBQUMsaUNBQWlDQTtZQUMvQyxPQUFPVCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUErQixHQUN4QztnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUFMLFFBQVFDLEdBQUcsQ0FBQyxpQkFBaUI7WUFDM0JLLFNBQVNKLE1BQU1JO1lBQ2ZDLFVBQVVMLE1BQU1LO1lBQ2hCQyxhQUFhLENBQUMsQ0FBQ04sTUFBTU87WUFDckJDLFdBQVdSLE1BQU1RO1lBQ2pCQyxVQUFVVCxNQUFNUztZQUNoQkMsUUFBUVYsTUFBTVU7WUFDZEMsTUFBTVgsTUFBTVc7UUFDZDtRQUVBLHNCQUFzQjtRQUN0QixJQUFJLENBQUNYLE1BQU07WUFDVEYsUUFBUUMsR0FBRyxDQUFDO1lBQ1osT0FBT04scURBQVlBLENBQUNRLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU87WUFBcUMsR0FDOUM7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLE1BQU0sRUFBRUMsT0FBTyxFQUFFQyxRQUFRLEVBQUVFLFFBQVEsRUFBRUMsU0FBUyxFQUFFQyxRQUFRLEVBQUUsR0FBR1Q7UUFFN0QsSUFBSSxDQUFDSSxTQUFTO1lBQ1pOLFFBQVFDLEdBQUcsQ0FBQztZQUNaLE9BQU9OLHFEQUFZQSxDQUFDUSxJQUFJLENBQ3RCO2dCQUFFQyxPQUFPO1lBQXNCLEdBQy9CO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxJQUFJLENBQUNFLFVBQVU7WUFDYlAsUUFBUUMsR0FBRyxDQUFDO1lBQ1osT0FBT04scURBQVlBLENBQUNRLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU87WUFBdUIsR0FDaEM7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLElBQUksQ0FBQ0ksVUFBVTtZQUNiVCxRQUFRQyxHQUFHLENBQUM7WUFDWixPQUFPTixxREFBWUEsQ0FBQ1EsSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUF1QixHQUNoQztnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsSUFBSSxDQUFDSyxXQUFXO1lBQ2RWLFFBQVFDLEdBQUcsQ0FBQztZQUNaLE9BQU9OLHFEQUFZQSxDQUFDUSxJQUFJLENBQ3RCO2dCQUFFQyxPQUFPO1lBQXdCLEdBQ2pDO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxJQUFJLENBQUNNLFVBQVU7WUFDYlgsUUFBUUMsR0FBRyxDQUFDO1lBQ1osT0FBT04scURBQVlBLENBQUNRLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU87WUFBdUIsR0FDaEM7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLHVCQUF1QjtRQUN2QkwsUUFBUUMsR0FBRyxDQUFDO1FBQ1osTUFBTWEsT0FBTyxNQUFNbEIsaUVBQWFBLENBQUM7WUFDL0JVO1lBQ0FDO1lBQ0FFO1lBQ0FDO1lBQ0FDO1lBQ0FDLFFBQVFWLEtBQUtVLE1BQU0sSUFBSTtZQUN2QkMsTUFBTVgsS0FBS1csSUFBSTtRQUNqQjtRQUNBYixRQUFRQyxHQUFHLENBQUM7UUFFWix5QkFBeUI7UUFDekJELFFBQVFDLEdBQUcsQ0FBQztRQUNaLE1BQU1XLFNBQVMsTUFBTWYscUVBQWlCQSxDQUFDaUI7UUFDdkNkLFFBQVFDLEdBQUcsQ0FBQztRQUVaLGtCQUFrQjtRQUNsQkQsUUFBUUMsR0FBRyxDQUFDO1FBQ1osT0FBT04scURBQVlBLENBQUNRLElBQUksQ0FBQ1M7SUFDM0IsRUFBRSxPQUFPUixPQUFZO1FBQ25CSixRQUFRSSxLQUFLLENBQUMsMEJBQTBCQTtRQUV4QyxPQUFPVCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUN0QjtZQUFFQyxPQUFPQSxNQUFNVyxPQUFPLElBQUk7UUFBeUIsR0FDbkQ7WUFBRVYsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3J3aWxzb24vRGVza3RvcC9wcm9qZWN0cy9FWlZpei9hcHAvYXBpL3Nub3dmbGFrZS9zY2hlbWEvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcbmltcG9ydCB7IGdldENvbm5lY3Rpb24sIGdldERhdGFiYXNlU2NoZW1hIH0gZnJvbSAnQC9hcHAvbGliL3Nub3dmbGFrZSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZygnUmVjZWl2ZWQgc2NoZW1hIHJlcXVlc3QnKTtcbiAgICBcbiAgICBsZXQgYm9keTtcbiAgICB0cnkge1xuICAgICAgYm9keSA9IGF3YWl0IHJlcS5qc29uKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSByZXF1ZXN0IGJvZHk6JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiAnSW52YWxpZCBKU09OIGluIHJlcXVlc3QgYm9keScgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICBjb25zb2xlLmxvZygnUmVxdWVzdCBib2R5OicsIHtcbiAgICAgIGFjY291bnQ6IGJvZHk/LmFjY291bnQsXG4gICAgICB1c2VybmFtZTogYm9keT8udXNlcm5hbWUsXG4gICAgICBoYXNQYXNzd29yZDogISFib2R5Py5wYXNzd29yZCxcbiAgICAgIHdhcmVob3VzZTogYm9keT8ud2FyZWhvdXNlLFxuICAgICAgZGF0YWJhc2U6IGJvZHk/LmRhdGFiYXNlLFxuICAgICAgc2NoZW1hOiBib2R5Py5zY2hlbWEsXG4gICAgICByb2xlOiBib2R5Py5yb2xlXG4gICAgfSk7XG5cbiAgICAvLyBWYWxpZGF0ZSBjb25uZWN0aW9uXG4gICAgaWYgKCFib2R5KSB7XG4gICAgICBjb25zb2xlLmxvZygnTm8gYm9keSBwcm92aWRlZCcpO1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiAnQ29ubmVjdGlvbiBpbmZvcm1hdGlvbiBpcyByZXF1aXJlZCcgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IHsgYWNjb3VudCwgdXNlcm5hbWUsIHBhc3N3b3JkLCB3YXJlaG91c2UsIGRhdGFiYXNlIH0gPSBib2R5O1xuICAgIFxuICAgIGlmICghYWNjb3VudCkge1xuICAgICAgY29uc29sZS5sb2coJ01pc3NpbmcgYWNjb3VudCBwYXJhbWV0ZXInKTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ0FjY291bnQgaXMgcmVxdWlyZWQnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKCF1c2VybmFtZSkge1xuICAgICAgY29uc29sZS5sb2coJ01pc3NpbmcgdXNlcm5hbWUgcGFyYW1ldGVyJyk7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6ICdVc2VybmFtZSBpcyByZXF1aXJlZCcgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICBpZiAoIXBhc3N3b3JkKSB7XG4gICAgICBjb25zb2xlLmxvZygnTWlzc2luZyBwYXNzd29yZCBwYXJhbWV0ZXInKTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ1Bhc3N3b3JkIGlzIHJlcXVpcmVkJyB9LFxuICAgICAgICB7IHN0YXR1czogNDAwIH1cbiAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIGlmICghd2FyZWhvdXNlKSB7XG4gICAgICBjb25zb2xlLmxvZygnTWlzc2luZyB3YXJlaG91c2UgcGFyYW1ldGVyJyk7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6ICdXYXJlaG91c2UgaXMgcmVxdWlyZWQnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKCFkYXRhYmFzZSkge1xuICAgICAgY29uc29sZS5sb2coJ01pc3NpbmcgZGF0YWJhc2UgcGFyYW1ldGVyJyk7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6ICdEYXRhYmFzZSBpcyByZXF1aXJlZCcgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIEVzdGFibGlzaCBjb25uZWN0aW9uXG4gICAgY29uc29sZS5sb2coJ0F0dGVtcHRpbmcgdG8gZXN0YWJsaXNoIGNvbm5lY3Rpb24gdG8gU25vd2ZsYWtlJyk7XG4gICAgY29uc3QgY29ubiA9IGF3YWl0IGdldENvbm5lY3Rpb24oe1xuICAgICAgYWNjb3VudCxcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICB3YXJlaG91c2UsXG4gICAgICBkYXRhYmFzZSxcbiAgICAgIHNjaGVtYTogYm9keS5zY2hlbWEgfHwgJ1BVQkxJQycsXG4gICAgICByb2xlOiBib2R5LnJvbGVcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZygnQ29ubmVjdGlvbiBlc3RhYmxpc2hlZCBzdWNjZXNzZnVsbHknKTtcblxuICAgIC8vIEdldCBzY2hlbWEgaW5mb3JtYXRpb25cbiAgICBjb25zb2xlLmxvZygnRmV0Y2hpbmcgc2NoZW1hIGluZm9ybWF0aW9uJyk7XG4gICAgY29uc3Qgc2NoZW1hID0gYXdhaXQgZ2V0RGF0YWJhc2VTY2hlbWEoY29ubik7XG4gICAgY29uc29sZS5sb2coJ1NjaGVtYSBmZXRjaGVkIHN1Y2Nlc3NmdWxseScpO1xuXG4gICAgLy8gUmV0dXJuIHJlc3BvbnNlXG4gICAgY29uc29sZS5sb2coJ1JldHVybmluZyBzY2hlbWEgcmVzcG9uc2UnKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oc2NoZW1hKTtcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIHNjaGVtYTonLCBlcnJvcik7XG4gICAgXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogZXJyb3IubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGZldGNoIHNjaGVtYScgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn0gIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImdldENvbm5lY3Rpb24iLCJnZXREYXRhYmFzZVNjaGVtYSIsIlBPU1QiLCJyZXEiLCJjb25zb2xlIiwibG9nIiwiYm9keSIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsImFjY291bnQiLCJ1c2VybmFtZSIsImhhc1Bhc3N3b3JkIiwicGFzc3dvcmQiLCJ3YXJlaG91c2UiLCJkYXRhYmFzZSIsInNjaGVtYSIsInJvbGUiLCJjb25uIiwibWVzc2FnZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/snowflake/schema/route.ts\n");

/***/ }),

/***/ "(rsc)/./app/lib/snowflake.ts":
/*!******************************!*\
  !*** ./app/lib/snowflake.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   closeAllConnections: () => (/* binding */ closeAllConnections),\n/* harmony export */   deleteData: () => (/* binding */ deleteData),\n/* harmony export */   executeQuery: () => (/* binding */ executeQuery),\n/* harmony export */   getColumnsForTable: () => (/* binding */ getColumnsForTable),\n/* harmony export */   getConnection: () => (/* binding */ getConnection),\n/* harmony export */   getDatabaseSchema: () => (/* binding */ getDatabaseSchema),\n/* harmony export */   getTablesForSchema: () => (/* binding */ getTablesForSchema),\n/* harmony export */   insertData: () => (/* binding */ insertData),\n/* harmony export */   updateData: () => (/* binding */ updateData)\n/* harmony export */ });\n/* harmony import */ var snowflake_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! snowflake-sdk */ \"(rsc)/./node_modules/snowflake-sdk/index.js\");\n/* harmony import */ var snowflake_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(snowflake_sdk__WEBPACK_IMPORTED_MODULE_0__);\n\n// Connection pool to reuse connections\nconst connectionPool = {};\n// Get a Snowflake connection (reuse if exists)\nasync function getConnection(config) {\n    const connectionKey = `${config.account}:${config.username}:${config.database}:${config.role || 'default'}`;\n    // Handle Snowflake account URL format\n    let accountId = config.account;\n    // Remove .snowflakecomputing.com if it's already included\n    if (accountId.includes('.snowflakecomputing.com')) {\n        accountId = accountId.replace('.snowflakecomputing.com', '');\n    }\n    console.log('Processing Snowflake connection with account ID:', accountId);\n    if (connectionPool[connectionKey] && isConnectionUp(connectionPool[connectionKey])) {\n        return connectionPool[connectionKey];\n    }\n    return new Promise((resolve, reject)=>{\n        // Create a connection\n        const connection = snowflake_sdk__WEBPACK_IMPORTED_MODULE_0___default().createConnection({\n            account: accountId,\n            username: config.username,\n            password: config.password,\n            warehouse: config.warehouse,\n            database: config.database,\n            schema: config.schema || 'PUBLIC',\n            role: config.role\n        });\n        // Connect to Snowflake\n        connection.connect((err, conn)=>{\n            if (err) {\n                console.error('Error connecting to Snowflake:', err);\n                // Provide more helpful error messages\n                if (err.message && err.message.includes('Hostname/IP does not match certificate')) {\n                    reject(new Error('Invalid Snowflake account format. Please enter just the account identifier without the full domain.'));\n                } else if (err.message && err.message.includes('Authentication failed')) {\n                    reject(new Error('Authentication failed. Please check your username and password.'));\n                } else if (err.message && err.message.includes('Database') && err.message.includes('not found')) {\n                    reject(new Error('Database not found. Please check your database name.'));\n                } else if (err.message && err.message.includes('Warehouse') && err.message.includes('not found')) {\n                    reject(new Error('Warehouse not found. Please check your warehouse name.'));\n                } else {\n                    reject(err);\n                }\n            } else {\n                if (conn) {\n                    connectionPool[connectionKey] = conn;\n                    resolve(conn);\n                } else {\n                    reject(new Error('Failed to establish connection to Snowflake'));\n                }\n            }\n        });\n    });\n}\n// Check if connection is up\nfunction isConnectionUp(connection) {\n    try {\n        // This is a simple check, might need to be adjusted based on Snowflake SDK specifics\n        return connection !== null && connection !== undefined;\n    } catch (err) {\n        return false;\n    }\n}\n// Execute a SQL query and return results\nasync function executeQuery(connection, query, binds = []) {\n    return new Promise((resolve, reject)=>{\n        connection.execute({\n            sqlText: query,\n            binds: binds,\n            complete: (err, stmt, rows)=>{\n                if (err) {\n                    console.error('Error executing query:', err);\n                    reject(err);\n                } else {\n                    resolve(rows || []);\n                }\n            }\n        });\n    });\n}\n// Get database schema names only (lightweight initial load)\nasync function getDatabaseSchema(connection) {\n    try {\n        console.log('Getting database schemas');\n        // First, get a list of all schemas in the database\n        const schemaQuery = `\n      SELECT \n        SCHEMA_NAME \n      FROM \n        INFORMATION_SCHEMA.SCHEMATA \n      WHERE \n        SCHEMA_NAME NOT LIKE 'INFORMATION_SCHEMA%'\n        AND CATALOG_NAME = CURRENT_DATABASE()\n      ORDER BY \n        SCHEMA_NAME`;\n        const schemaResults = await executeQuery(connection, schemaQuery, []);\n        const schemas = schemaResults.map((row)=>row.SCHEMA_NAME);\n        console.log(`Found ${schemas.length} schemas:`, schemas);\n        // Return just schema names for faster initial load\n        const schemasData = schemas.map((schemaName)=>({\n                name: schemaName,\n                tables: [] // Empty tables array - will be populated on demand\n            }));\n        return {\n            name: await getCurrentDatabase(connection),\n            schemas: schemasData\n        };\n    } catch (error) {\n        console.error('Error getting database schema:', error);\n        throw error;\n    }\n}\n// Get tables for a specific schema (on demand loading)\nasync function getTablesForSchema(connection, schemaName) {\n    try {\n        console.log(`Getting tables for schema: ${schemaName}`);\n        const tablesQuery = `\n      SELECT \n        TABLE_NAME\n      FROM \n        INFORMATION_SCHEMA.TABLES \n      WHERE \n        TABLE_SCHEMA = ? \n        AND TABLE_TYPE = 'BASE TABLE'\n      ORDER BY \n        TABLE_NAME`;\n        const tableResults = await executeQuery(connection, tablesQuery, [\n            schemaName\n        ]);\n        // Return just table names for now\n        return tableResults.map((row)=>({\n                name: row.TABLE_NAME,\n                columns: [] // Empty columns array - will be populated on demand\n            }));\n    } catch (error) {\n        console.error(`Error getting tables for schema ${schemaName}:`, error);\n        throw error;\n    }\n}\n// Get columns for a specific table (on demand loading)\nasync function getColumnsForTable(connection, schemaName, tableName) {\n    try {\n        console.log(`Getting columns for table: ${schemaName}.${tableName}`);\n        const columnsQuery = `\n      SELECT \n        COLUMN_NAME,\n        DATA_TYPE,\n        IS_NULLABLE,\n        COLUMN_DEFAULT,\n        CHARACTER_MAXIMUM_LENGTH\n      FROM \n        INFORMATION_SCHEMA.COLUMNS \n      WHERE \n        TABLE_SCHEMA = ? \n        AND TABLE_NAME = ?\n      ORDER BY \n        ORDINAL_POSITION`;\n        const columnResults = await executeQuery(connection, columnsQuery, [\n            schemaName,\n            tableName\n        ]);\n        // Format column results - without trying to detect PK/FK relationships\n        return columnResults.map((col)=>{\n            return {\n                name: col.COLUMN_NAME,\n                type: col.DATA_TYPE,\n                isNullable: col.IS_NULLABLE === 'YES',\n                defaultValue: col.COLUMN_DEFAULT,\n                maxLength: col.CHARACTER_MAXIMUM_LENGTH,\n                // Assume common ID patterns\n                isPrimaryKey: col.COLUMN_NAME.toUpperCase() === 'ID' || col.COLUMN_NAME.toUpperCase().endsWith('_ID') && col.COLUMN_NAME.toUpperCase() === `${tableName.toUpperCase()}_ID`,\n                isForeignKey: col.COLUMN_NAME.toUpperCase().endsWith('_ID') && col.COLUMN_NAME.toUpperCase() !== `${tableName.toUpperCase()}_ID`\n            };\n        });\n    } catch (error) {\n        console.error(`Error getting columns for table ${schemaName}.${tableName}:`, error);\n        throw error;\n    }\n}\n// Helper to get current database name\nasync function getCurrentDatabase(connection) {\n    const result = await executeQuery(connection, 'SELECT CURRENT_DATABASE() AS DB_NAME', []);\n    return result[0].DB_NAME;\n}\n// Insert data\nasync function insertData(connection, tableName, data) {\n    const columns = Object.keys(data);\n    const placeholders = columns.map(()=>'?').join(', ');\n    const values = columns.map((col)=>data[col]);\n    const query = `\n    INSERT INTO ${tableName} (${columns.join(', ')})\n    VALUES (${placeholders})\n  `;\n    return executeQuery(connection, query, values);\n}\n// Update data\nasync function updateData(connection, tableName, data, whereClause, whereParams = []) {\n    const setClause = Object.keys(data).map((col)=>`${col} = ?`).join(', ');\n    const values = [\n        ...Object.values(data),\n        ...whereParams\n    ];\n    const query = `\n    UPDATE ${tableName}\n    SET ${setClause}\n    WHERE ${whereClause}\n  `;\n    return executeQuery(connection, query, values);\n}\n// Delete data\nasync function deleteData(connection, tableName, whereClause, whereParams = []) {\n    const query = `\n    DELETE FROM ${tableName}\n    WHERE ${whereClause}\n  `;\n    return executeQuery(connection, query, whereParams);\n}\n// Close all connections\nfunction closeAllConnections() {\n    Object.values(connectionPool).forEach((conn)=>{\n        if (conn && isConnectionUp(conn)) {\n            conn.destroy((err)=>{\n                if (err) console.error('Error closing connection:', err);\n            });\n        }\n    });\n    // Clear the connection pool\n    Object.keys(connectionPool).forEach((key)=>{\n        delete connectionPool[key];\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVELE1BQU10RCxRQUFRLENBQUM7V0FDTixFQUFFMEIsVUFBVTtRQUNmLEVBQUU2QixVQUFVO1VBQ1YsRUFBRUYsWUFBWTtFQUN0QixDQUFDO0lBRUQsT0FBT3RELGFBQWFaLFlBQVlhLE9BQU9tRDtBQUN6QztBQUVBLGNBQWM7QUFDUCxlQUFlSyxXQUNwQnJFLFVBQWdDLEVBQ2hDdUMsU0FBaUIsRUFDakIyQixXQUFtQixFQUNuQkMsY0FBcUIsRUFBRTtJQUV2QixNQUFNdEQsUUFBUSxDQUFDO2dCQUNELEVBQUUwQixVQUFVO1VBQ2xCLEVBQUUyQixZQUFZO0VBQ3RCLENBQUM7SUFFRCxPQUFPdEQsYUFBYVosWUFBWWEsT0FBT3NEO0FBQ3pDO0FBRUEsd0JBQXdCO0FBQ2pCLFNBQVNHO0lBQ2RWLE9BQU9JLE1BQU0sQ0FBQ2pGLGdCQUFnQndGLE9BQU8sQ0FBQ2hFLENBQUFBO1FBQ3BDLElBQUlBLFFBQVFYLGVBQWVXLE9BQU87WUFDaENBLEtBQUtpRSxPQUFPLENBQUNsRSxDQUFBQTtnQkFDWCxJQUFJQSxLQUFLWixRQUFRYyxLQUFLLENBQUMsNkJBQTZCRjtZQUN0RDtRQUNGO0lBQ0Y7SUFFQSw0QkFBNEI7SUFDNUJzRCxPQUFPQyxJQUFJLENBQUM5RSxnQkFBZ0J3RixPQUFPLENBQUNFLENBQUFBO1FBQ2xDLE9BQU8xRixjQUFjLENBQUMwRixJQUFJO0lBQzVCO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy92aWN0b3J3aWxzb24vRGVza3RvcC9wcm9qZWN0cy9FWlZpei9hcHAvbGliL3Nub3dmbGFrZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc25vd2ZsYWtlIGZyb20gJ3Nub3dmbGFrZS1zZGsnO1xuXG4vLyBTbm93Zmxha2UgY29ubmVjdGlvbiBjb25maWd1cmF0aW9uXG5pbnRlcmZhY2UgU25vd2ZsYWtlQ29uZmlnIHtcbiAgYWNjb3VudDogc3RyaW5nO1xuICB1c2VybmFtZTogc3RyaW5nO1xuICBwYXNzd29yZDogc3RyaW5nO1xuICB3YXJlaG91c2U6IHN0cmluZztcbiAgZGF0YWJhc2U6IHN0cmluZztcbiAgc2NoZW1hPzogc3RyaW5nO1xuICByb2xlPzogc3RyaW5nO1xufVxuXG4vLyBDb25uZWN0aW9uIHBvb2wgdG8gcmV1c2UgY29ubmVjdGlvbnNcbmNvbnN0IGNvbm5lY3Rpb25Qb29sOiBSZWNvcmQ8c3RyaW5nLCBzbm93Zmxha2UuQ29ubmVjdGlvbj4gPSB7fTtcblxuLy8gR2V0IGEgU25vd2ZsYWtlIGNvbm5lY3Rpb24gKHJldXNlIGlmIGV4aXN0cylcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDb25uZWN0aW9uKGNvbmZpZzogU25vd2ZsYWtlQ29uZmlnKTogUHJvbWlzZTxzbm93Zmxha2UuQ29ubmVjdGlvbj4ge1xuICBjb25zdCBjb25uZWN0aW9uS2V5ID0gYCR7Y29uZmlnLmFjY291bnR9OiR7Y29uZmlnLnVzZXJuYW1lfToke2NvbmZpZy5kYXRhYmFzZX06JHtjb25maWcucm9sZSB8fCAnZGVmYXVsdCd9YDtcbiAgXG4gIC8vIEhhbmRsZSBTbm93Zmxha2UgYWNjb3VudCBVUkwgZm9ybWF0XG4gIGxldCBhY2NvdW50SWQgPSBjb25maWcuYWNjb3VudDtcbiAgXG4gIC8vIFJlbW92ZSAuc25vd2ZsYWtlY29tcHV0aW5nLmNvbSBpZiBpdCdzIGFscmVhZHkgaW5jbHVkZWRcbiAgaWYgKGFjY291bnRJZC5pbmNsdWRlcygnLnNub3dmbGFrZWNvbXB1dGluZy5jb20nKSkge1xuICAgIGFjY291bnRJZCA9IGFjY291bnRJZC5yZXBsYWNlKCcuc25vd2ZsYWtlY29tcHV0aW5nLmNvbScsICcnKTtcbiAgfVxuICBcbiAgY29uc29sZS5sb2coJ1Byb2Nlc3NpbmcgU25vd2ZsYWtlIGNvbm5lY3Rpb24gd2l0aCBhY2NvdW50IElEOicsIGFjY291bnRJZCk7XG4gIFxuICBpZiAoY29ubmVjdGlvblBvb2xbY29ubmVjdGlvbktleV0gJiYgaXNDb25uZWN0aW9uVXAoY29ubmVjdGlvblBvb2xbY29ubmVjdGlvbktleV0pKSB7XG4gICAgcmV0dXJuIGNvbm5lY3Rpb25Qb29sW2Nvbm5lY3Rpb25LZXldO1xuICB9XG4gIFxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIC8vIENyZWF0ZSBhIGNvbm5lY3Rpb25cbiAgICBjb25zdCBjb25uZWN0aW9uID0gc25vd2ZsYWtlLmNyZWF0ZUNvbm5lY3Rpb24oe1xuICAgICAgYWNjb3VudDogYWNjb3VudElkLFxuICAgICAgdXNlcm5hbWU6IGNvbmZpZy51c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkOiBjb25maWcucGFzc3dvcmQsXG4gICAgICB3YXJlaG91c2U6IGNvbmZpZy53YXJlaG91c2UsXG4gICAgICBkYXRhYmFzZTogY29uZmlnLmRhdGFiYXNlLFxuICAgICAgc2NoZW1hOiBjb25maWcuc2NoZW1hIHx8ICdQVUJMSUMnLFxuICAgICAgcm9sZTogY29uZmlnLnJvbGVcbiAgICB9KTtcbiAgICBcbiAgICAvLyBDb25uZWN0IHRvIFNub3dmbGFrZVxuICAgIGNvbm5lY3Rpb24uY29ubmVjdCgoZXJyLCBjb25uKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNvbm5lY3RpbmcgdG8gU25vd2ZsYWtlOicsIGVycik7XG4gICAgICAgIFxuICAgICAgICAvLyBQcm92aWRlIG1vcmUgaGVscGZ1bCBlcnJvciBtZXNzYWdlc1xuICAgICAgICBpZiAoZXJyLm1lc3NhZ2UgJiYgZXJyLm1lc3NhZ2UuaW5jbHVkZXMoJ0hvc3RuYW1lL0lQIGRvZXMgbm90IG1hdGNoIGNlcnRpZmljYXRlJykpIHtcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdJbnZhbGlkIFNub3dmbGFrZSBhY2NvdW50IGZvcm1hdC4gUGxlYXNlIGVudGVyIGp1c3QgdGhlIGFjY291bnQgaWRlbnRpZmllciB3aXRob3V0IHRoZSBmdWxsIGRvbWFpbi4nKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXJyLm1lc3NhZ2UgJiYgZXJyLm1lc3NhZ2UuaW5jbHVkZXMoJ0F1dGhlbnRpY2F0aW9uIGZhaWxlZCcpKSB7XG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignQXV0aGVudGljYXRpb24gZmFpbGVkLiBQbGVhc2UgY2hlY2sgeW91ciB1c2VybmFtZSBhbmQgcGFzc3dvcmQuJykpO1xuICAgICAgICB9IGVsc2UgaWYgKGVyci5tZXNzYWdlICYmIGVyci5tZXNzYWdlLmluY2x1ZGVzKCdEYXRhYmFzZScpICYmIGVyci5tZXNzYWdlLmluY2x1ZGVzKCdub3QgZm91bmQnKSkge1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ0RhdGFiYXNlIG5vdCBmb3VuZC4gUGxlYXNlIGNoZWNrIHlvdXIgZGF0YWJhc2UgbmFtZS4nKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXJyLm1lc3NhZ2UgJiYgZXJyLm1lc3NhZ2UuaW5jbHVkZXMoJ1dhcmVob3VzZScpICYmIGVyci5tZXNzYWdlLmluY2x1ZGVzKCdub3QgZm91bmQnKSkge1xuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ1dhcmVob3VzZSBub3QgZm91bmQuIFBsZWFzZSBjaGVjayB5b3VyIHdhcmVob3VzZSBuYW1lLicpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNvbm4pIHtcbiAgICAgICAgICBjb25uZWN0aW9uUG9vbFtjb25uZWN0aW9uS2V5XSA9IGNvbm47XG4gICAgICAgICAgcmVzb2x2ZShjb25uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdGYWlsZWQgdG8gZXN0YWJsaXNoIGNvbm5lY3Rpb24gdG8gU25vd2ZsYWtlJykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vLyBDaGVjayBpZiBjb25uZWN0aW9uIGlzIHVwXG5mdW5jdGlvbiBpc0Nvbm5lY3Rpb25VcChjb25uZWN0aW9uOiBzbm93Zmxha2UuQ29ubmVjdGlvbik6IGJvb2xlYW4ge1xuICB0cnkge1xuICAgIC8vIFRoaXMgaXMgYSBzaW1wbGUgY2hlY2ssIG1pZ2h0IG5lZWQgdG8gYmUgYWRqdXN0ZWQgYmFzZWQgb24gU25vd2ZsYWtlIFNESyBzcGVjaWZpY3NcbiAgICByZXR1cm4gY29ubmVjdGlvbiAhPT0gbnVsbCAmJiBjb25uZWN0aW9uICE9PSB1bmRlZmluZWQ7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vLyBFeGVjdXRlIGEgU1FMIHF1ZXJ5IGFuZCByZXR1cm4gcmVzdWx0c1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGVRdWVyeShcbiAgY29ubmVjdGlvbjogc25vd2ZsYWtlLkNvbm5lY3Rpb24sIFxuICBxdWVyeTogc3RyaW5nLCBcbiAgYmluZHM6IGFueVtdID0gW11cbik6IFByb21pc2U8YW55W10+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25uZWN0aW9uLmV4ZWN1dGUoe1xuICAgICAgc3FsVGV4dDogcXVlcnksXG4gICAgICBiaW5kczogYmluZHMsXG4gICAgICBjb21wbGV0ZTogKGVyciwgc3RtdCwgcm93cykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZXhlY3V0aW5nIHF1ZXJ5OicsIGVycik7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShyb3dzIHx8IFtdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuLy8gR2V0IGRhdGFiYXNlIHNjaGVtYSBuYW1lcyBvbmx5IChsaWdodHdlaWdodCBpbml0aWFsIGxvYWQpXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YWJhc2VTY2hlbWEoY29ubmVjdGlvbjogc25vd2ZsYWtlLkNvbm5lY3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICB0cnkge1xuICAgIGNvbnNvbGUubG9nKCdHZXR0aW5nIGRhdGFiYXNlIHNjaGVtYXMnKTtcbiAgICBcbiAgICAvLyBGaXJzdCwgZ2V0IGEgbGlzdCBvZiBhbGwgc2NoZW1hcyBpbiB0aGUgZGF0YWJhc2VcbiAgICBjb25zdCBzY2hlbWFRdWVyeSA9IGBcbiAgICAgIFNFTEVDVCBcbiAgICAgICAgU0NIRU1BX05BTUUgXG4gICAgICBGUk9NIFxuICAgICAgICBJTkZPUk1BVElPTl9TQ0hFTUEuU0NIRU1BVEEgXG4gICAgICBXSEVSRSBcbiAgICAgICAgU0NIRU1BX05BTUUgTk9UIExJS0UgJ0lORk9STUFUSU9OX1NDSEVNQSUnXG4gICAgICAgIEFORCBDQVRBTE9HX05BTUUgPSBDVVJSRU5UX0RBVEFCQVNFKClcbiAgICAgIE9SREVSIEJZIFxuICAgICAgICBTQ0hFTUFfTkFNRWA7XG4gICAgXG4gICAgY29uc3Qgc2NoZW1hUmVzdWx0cyA9IGF3YWl0IGV4ZWN1dGVRdWVyeShjb25uZWN0aW9uLCBzY2hlbWFRdWVyeSwgW10pO1xuICAgIGNvbnN0IHNjaGVtYXMgPSBzY2hlbWFSZXN1bHRzLm1hcCgocm93OiBhbnkpID0+IHJvdy5TQ0hFTUFfTkFNRSk7XG4gICAgXG4gICAgY29uc29sZS5sb2coYEZvdW5kICR7c2NoZW1hcy5sZW5ndGh9IHNjaGVtYXM6YCwgc2NoZW1hcyk7XG4gICAgXG4gICAgLy8gUmV0dXJuIGp1c3Qgc2NoZW1hIG5hbWVzIGZvciBmYXN0ZXIgaW5pdGlhbCBsb2FkXG4gICAgY29uc3Qgc2NoZW1hc0RhdGEgPSBzY2hlbWFzLm1hcChzY2hlbWFOYW1lID0+ICh7XG4gICAgICBuYW1lOiBzY2hlbWFOYW1lLFxuICAgICAgdGFibGVzOiBbXSAvLyBFbXB0eSB0YWJsZXMgYXJyYXkgLSB3aWxsIGJlIHBvcHVsYXRlZCBvbiBkZW1hbmRcbiAgICB9KSk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IGF3YWl0IGdldEN1cnJlbnREYXRhYmFzZShjb25uZWN0aW9uKSxcbiAgICAgIHNjaGVtYXM6IHNjaGVtYXNEYXRhXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIGRhdGFiYXNlIHNjaGVtYTonLCBlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuLy8gR2V0IHRhYmxlcyBmb3IgYSBzcGVjaWZpYyBzY2hlbWEgKG9uIGRlbWFuZCBsb2FkaW5nKVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRhYmxlc0ZvclNjaGVtYShjb25uZWN0aW9uOiBzbm93Zmxha2UuQ29ubmVjdGlvbiwgc2NoZW1hTmFtZTogc3RyaW5nKTogUHJvbWlzZTxhbnlbXT4ge1xuICB0cnkge1xuICAgIGNvbnNvbGUubG9nKGBHZXR0aW5nIHRhYmxlcyBmb3Igc2NoZW1hOiAke3NjaGVtYU5hbWV9YCk7XG4gICAgXG4gICAgY29uc3QgdGFibGVzUXVlcnkgPSBgXG4gICAgICBTRUxFQ1QgXG4gICAgICAgIFRBQkxFX05BTUVcbiAgICAgIEZST00gXG4gICAgICAgIElORk9STUFUSU9OX1NDSEVNQS5UQUJMRVMgXG4gICAgICBXSEVSRSBcbiAgICAgICAgVEFCTEVfU0NIRU1BID0gPyBcbiAgICAgICAgQU5EIFRBQkxFX1RZUEUgPSAnQkFTRSBUQUJMRSdcbiAgICAgIE9SREVSIEJZIFxuICAgICAgICBUQUJMRV9OQU1FYDtcbiAgICBcbiAgICBjb25zdCB0YWJsZVJlc3VsdHMgPSBhd2FpdCBleGVjdXRlUXVlcnkoY29ubmVjdGlvbiwgdGFibGVzUXVlcnksIFtzY2hlbWFOYW1lXSk7XG4gICAgXG4gICAgLy8gUmV0dXJuIGp1c3QgdGFibGUgbmFtZXMgZm9yIG5vd1xuICAgIHJldHVybiB0YWJsZVJlc3VsdHMubWFwKChyb3c6IGFueSkgPT4gKHtcbiAgICAgIG5hbWU6IHJvdy5UQUJMRV9OQU1FLFxuICAgICAgY29sdW1uczogW10gLy8gRW1wdHkgY29sdW1ucyBhcnJheSAtIHdpbGwgYmUgcG9wdWxhdGVkIG9uIGRlbWFuZFxuICAgIH0pKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGBFcnJvciBnZXR0aW5nIHRhYmxlcyBmb3Igc2NoZW1hICR7c2NoZW1hTmFtZX06YCwgZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbi8vIEdldCBjb2x1bW5zIGZvciBhIHNwZWNpZmljIHRhYmxlIChvbiBkZW1hbmQgbG9hZGluZylcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDb2x1bW5zRm9yVGFibGUoXG4gIGNvbm5lY3Rpb246IHNub3dmbGFrZS5Db25uZWN0aW9uLCBcbiAgc2NoZW1hTmFtZTogc3RyaW5nLCBcbiAgdGFibGVOYW1lOiBzdHJpbmdcbik6IFByb21pc2U8YW55W10+IHtcbiAgdHJ5IHtcbiAgICBjb25zb2xlLmxvZyhgR2V0dGluZyBjb2x1bW5zIGZvciB0YWJsZTogJHtzY2hlbWFOYW1lfS4ke3RhYmxlTmFtZX1gKTtcbiAgICBcbiAgICBjb25zdCBjb2x1bW5zUXVlcnkgPSBgXG4gICAgICBTRUxFQ1QgXG4gICAgICAgIENPTFVNTl9OQU1FLFxuICAgICAgICBEQVRBX1RZUEUsXG4gICAgICAgIElTX05VTExBQkxFLFxuICAgICAgICBDT0xVTU5fREVGQVVMVCxcbiAgICAgICAgQ0hBUkFDVEVSX01BWElNVU1fTEVOR1RIXG4gICAgICBGUk9NIFxuICAgICAgICBJTkZPUk1BVElPTl9TQ0hFTUEuQ09MVU1OUyBcbiAgICAgIFdIRVJFIFxuICAgICAgICBUQUJMRV9TQ0hFTUEgPSA/IFxuICAgICAgICBBTkQgVEFCTEVfTkFNRSA9ID9cbiAgICAgIE9SREVSIEJZIFxuICAgICAgICBPUkRJTkFMX1BPU0lUSU9OYDtcbiAgICBcbiAgICBjb25zdCBjb2x1bW5SZXN1bHRzID0gYXdhaXQgZXhlY3V0ZVF1ZXJ5KGNvbm5lY3Rpb24sIGNvbHVtbnNRdWVyeSwgW3NjaGVtYU5hbWUsIHRhYmxlTmFtZV0pO1xuICAgIFxuICAgIC8vIEZvcm1hdCBjb2x1bW4gcmVzdWx0cyAtIHdpdGhvdXQgdHJ5aW5nIHRvIGRldGVjdCBQSy9GSyByZWxhdGlvbnNoaXBzXG4gICAgcmV0dXJuIGNvbHVtblJlc3VsdHMubWFwKChjb2w6IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogY29sLkNPTFVNTl9OQU1FLFxuICAgICAgICB0eXBlOiBjb2wuREFUQV9UWVBFLFxuICAgICAgICBpc051bGxhYmxlOiBjb2wuSVNfTlVMTEFCTEUgPT09ICdZRVMnLFxuICAgICAgICBkZWZhdWx0VmFsdWU6IGNvbC5DT0xVTU5fREVGQVVMVCxcbiAgICAgICAgbWF4TGVuZ3RoOiBjb2wuQ0hBUkFDVEVSX01BWElNVU1fTEVOR1RILFxuICAgICAgICAvLyBBc3N1bWUgY29tbW9uIElEIHBhdHRlcm5zXG4gICAgICAgIGlzUHJpbWFyeUtleTogY29sLkNPTFVNTl9OQU1FLnRvVXBwZXJDYXNlKCkgPT09ICdJRCcgfHwgXG4gICAgICAgICAgICAgICAgICAgICAgY29sLkNPTFVNTl9OQU1FLnRvVXBwZXJDYXNlKCkuZW5kc1dpdGgoJ19JRCcpICYmIFxuICAgICAgICAgICAgICAgICAgICAgIGNvbC5DT0xVTU5fTkFNRS50b1VwcGVyQ2FzZSgpID09PSBgJHt0YWJsZU5hbWUudG9VcHBlckNhc2UoKX1fSURgLFxuICAgICAgICBpc0ZvcmVpZ25LZXk6IGNvbC5DT0xVTU5fTkFNRS50b1VwcGVyQ2FzZSgpLmVuZHNXaXRoKCdfSUQnKSAmJiBcbiAgICAgICAgICAgICAgICAgICAgICBjb2wuQ09MVU1OX05BTUUudG9VcHBlckNhc2UoKSAhPT0gYCR7dGFibGVOYW1lLnRvVXBwZXJDYXNlKCl9X0lEYFxuICAgICAgfSBhcyBhbnk7XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihgRXJyb3IgZ2V0dGluZyBjb2x1bW5zIGZvciB0YWJsZSAke3NjaGVtYU5hbWV9LiR7dGFibGVOYW1lfTpgLCBlcnJvcik7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuLy8gSGVscGVyIHRvIGdldCBjdXJyZW50IGRhdGFiYXNlIG5hbWVcbmFzeW5jIGZ1bmN0aW9uIGdldEN1cnJlbnREYXRhYmFzZShjb25uZWN0aW9uOiBzbm93Zmxha2UuQ29ubmVjdGlvbik6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGV4ZWN1dGVRdWVyeShjb25uZWN0aW9uLCAnU0VMRUNUIENVUlJFTlRfREFUQUJBU0UoKSBBUyBEQl9OQU1FJywgW10pO1xuICByZXR1cm4gcmVzdWx0WzBdLkRCX05BTUU7XG59XG5cbi8vIEluc2VydCBkYXRhXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5zZXJ0RGF0YShcbiAgY29ubmVjdGlvbjogc25vd2ZsYWtlLkNvbm5lY3Rpb24sXG4gIHRhYmxlTmFtZTogc3RyaW5nLFxuICBkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4pOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBjb2x1bW5zID0gT2JqZWN0LmtleXMoZGF0YSk7XG4gIGNvbnN0IHBsYWNlaG9sZGVycyA9IGNvbHVtbnMubWFwKCgpID0+ICc/Jykuam9pbignLCAnKTtcbiAgY29uc3QgdmFsdWVzID0gY29sdW1ucy5tYXAoY29sID0+IGRhdGFbY29sXSk7XG4gIFxuICBjb25zdCBxdWVyeSA9IGBcbiAgICBJTlNFUlQgSU5UTyAke3RhYmxlTmFtZX0gKCR7Y29sdW1ucy5qb2luKCcsICcpfSlcbiAgICBWQUxVRVMgKCR7cGxhY2Vob2xkZXJzfSlcbiAgYDtcbiAgXG4gIHJldHVybiBleGVjdXRlUXVlcnkoY29ubmVjdGlvbiwgcXVlcnksIHZhbHVlcyk7XG59XG5cbi8vIFVwZGF0ZSBkYXRhXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlRGF0YShcbiAgY29ubmVjdGlvbjogc25vd2ZsYWtlLkNvbm5lY3Rpb24sXG4gIHRhYmxlTmFtZTogc3RyaW5nLFxuICBkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxuICB3aGVyZUNsYXVzZTogc3RyaW5nLFxuICB3aGVyZVBhcmFtczogYW55W10gPSBbXVxuKTogUHJvbWlzZTxhbnk+IHtcbiAgY29uc3Qgc2V0Q2xhdXNlID0gT2JqZWN0LmtleXMoZGF0YSlcbiAgICAubWFwKGNvbCA9PiBgJHtjb2x9ID0gP2ApXG4gICAgLmpvaW4oJywgJyk7XG4gIFxuICBjb25zdCB2YWx1ZXMgPSBbXG4gICAgLi4uT2JqZWN0LnZhbHVlcyhkYXRhKSxcbiAgICAuLi53aGVyZVBhcmFtc1xuICBdO1xuICBcbiAgY29uc3QgcXVlcnkgPSBgXG4gICAgVVBEQVRFICR7dGFibGVOYW1lfVxuICAgIFNFVCAke3NldENsYXVzZX1cbiAgICBXSEVSRSAke3doZXJlQ2xhdXNlfVxuICBgO1xuICBcbiAgcmV0dXJuIGV4ZWN1dGVRdWVyeShjb25uZWN0aW9uLCBxdWVyeSwgdmFsdWVzKTtcbn1cblxuLy8gRGVsZXRlIGRhdGFcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVEYXRhKFxuICBjb25uZWN0aW9uOiBzbm93Zmxha2UuQ29ubmVjdGlvbixcbiAgdGFibGVOYW1lOiBzdHJpbmcsXG4gIHdoZXJlQ2xhdXNlOiBzdHJpbmcsXG4gIHdoZXJlUGFyYW1zOiBhbnlbXSA9IFtdXG4pOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBxdWVyeSA9IGBcbiAgICBERUxFVEUgRlJPTSAke3RhYmxlTmFtZX1cbiAgICBXSEVSRSAke3doZXJlQ2xhdXNlfVxuICBgO1xuICBcbiAgcmV0dXJuIGV4ZWN1dGVRdWVyeShjb25uZWN0aW9uLCBxdWVyeSwgd2hlcmVQYXJhbXMpO1xufVxuXG4vLyBDbG9zZSBhbGwgY29ubmVjdGlvbnNcbmV4cG9ydCBmdW5jdGlvbiBjbG9zZUFsbENvbm5lY3Rpb25zKCk6IHZvaWQge1xuICBPYmplY3QudmFsdWVzKGNvbm5lY3Rpb25Qb29sKS5mb3JFYWNoKGNvbm4gPT4ge1xuICAgIGlmIChjb25uICYmIGlzQ29ubmVjdGlvblVwKGNvbm4pKSB7XG4gICAgICBjb25uLmRlc3Ryb3koZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikgY29uc29sZS5lcnJvcignRXJyb3IgY2xvc2luZyBjb25uZWN0aW9uOicsIGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBcbiAgLy8gQ2xlYXIgdGhlIGNvbm5lY3Rpb24gcG9vbFxuICBPYmplY3Qua2V5cyhjb25uZWN0aW9uUG9vbCkuZm9yRWFjaChrZXkgPT4ge1xuICAgIGRlbGV0ZSBjb25uZWN0aW9uUG9vbFtrZXldO1xuICB9KTtcbn0gIl0sIm5hbWVzIjpbInNub3dmbGFrZSIsImNvbm5lY3Rpb25Qb29sIiwiZ2V0Q29ubmVjdGlvbiIsImNvbmZpZyIsImNvbm5lY3Rpb25LZXkiLCJhY2NvdW50IiwidXNlcm5hbWUiLCJkYXRhYmFzZSIsInJvbGUiLCJhY2NvdW50SWQiLCJpbmNsdWRlcyIsInJlcGxhY2UiLCJjb25zb2xlIiwibG9nIiwiaXNDb25uZWN0aW9uVXAiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNvbm5lY3Rpb24iLCJjcmVhdGVDb25uZWN0aW9uIiwicGFzc3dvcmQiLCJ3YXJlaG91c2UiLCJzY2hlbWEiLCJjb25uZWN0IiwiZXJyIiwiY29ubiIsImVycm9yIiwibWVzc2FnZSIsIkVycm9yIiwidW5kZWZpbmVkIiwiZXhlY3V0ZVF1ZXJ5IiwicXVlcnkiLCJiaW5kcyIsImV4ZWN1dGUiLCJzcWxUZXh0IiwiY29tcGxldGUiLCJzdG10Iiwicm93cyIsImdldERhdGFiYXNlU2NoZW1hIiwic2NoZW1hUXVlcnkiLCJzY2hlbWFSZXN1bHRzIiwic2NoZW1hcyIsIm1hcCIsInJvdyIsIlNDSEVNQV9OQU1FIiwibGVuZ3RoIiwic2NoZW1hc0RhdGEiLCJzY2hlbWFOYW1lIiwibmFtZSIsInRhYmxlcyIsImdldEN1cnJlbnREYXRhYmFzZSIsImdldFRhYmxlc0ZvclNjaGVtYSIsInRhYmxlc1F1ZXJ5IiwidGFibGVSZXN1bHRzIiwiVEFCTEVfTkFNRSIsImNvbHVtbnMiLCJnZXRDb2x1bW5zRm9yVGFibGUiLCJ0YWJsZU5hbWUiLCJjb2x1bW5zUXVlcnkiLCJjb2x1bW5SZXN1bHRzIiwiY29sIiwiQ09MVU1OX05BTUUiLCJ0eXBlIiwiREFUQV9UWVBFIiwiaXNOdWxsYWJsZSIsIklTX05VTExBQkxFIiwiZGVmYXVsdFZhbHVlIiwiQ09MVU1OX0RFRkFVTFQiLCJtYXhMZW5ndGgiLCJDSEFSQUNURVJfTUFYSU1VTV9MRU5HVEgiLCJpc1ByaW1hcnlLZXkiLCJ0b1VwcGVyQ2FzZSIsImVuZHNXaXRoIiwiaXNGb3JlaWduS2V5IiwicmVzdWx0IiwiREJfTkFNRSIsImluc2VydERhdGEiLCJkYXRhIiwiT2JqZWN0Iiwia2V5cyIsInBsYWNlaG9sZGVycyIsImpvaW4iLCJ2YWx1ZXMiLCJ1cGRhdGVEYXRhIiwid2hlcmVDbGF1c2UiLCJ3aGVyZVBhcmFtcyIsInNldENsYXVzZSIsImRlbGV0ZURhdGEiLCJjbG9zZUFsbENvbm5lY3Rpb25zIiwiZm9yRWFjaCIsImRlc3Ryb3kiLCJrZXkiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/lib/snowflake.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsnowflake%2Fschema%2Froute&page=%2Fapi%2Fsnowflake%2Fschema%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsnowflake%2Fschema%2Froute.ts&appDir=%2FUsers%2Fvictorwilson%2FDesktop%2Fprojects%2FEZViz%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fvictorwilson%2FDesktop%2Fprojects%2FEZViz&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsnowflake%2Fschema%2Froute&page=%2Fapi%2Fsnowflake%2Fschema%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsnowflake%2Fschema%2Froute.ts&appDir=%2FUsers%2Fvictorwilson%2FDesktop%2Fprojects%2FEZViz%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fvictorwilson%2FDesktop%2Fprojects%2FEZViz&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_victorwilson_Desktop_projects_EZViz_app_api_snowflake_schema_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/snowflake/schema/route.ts */ \"(rsc)/./app/api/snowflake/schema/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/snowflake/schema/route\",\n        pathname: \"/api/snowflake/schema\",\n        filename: \"route\",\n        bundlePath: \"app/api/snowflake/schema/route\"\n    },\n    resolvedPagePath: \"/Users/victorwilson/Desktop/projects/EZViz/app/api/snowflake/schema/route.ts\",\n    nextConfigOutput,\n    userland: _Users_victorwilson_Desktop_projects_EZViz_app_api_snowflake_schema_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzbm93Zmxha2UlMkZzY2hlbWElMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnNub3dmbGFrZSUyRnNjaGVtYSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnNub3dmbGFrZSUyRnNjaGVtYSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnZpY3RvcndpbHNvbiUyRkRlc2t0b3AlMkZwcm9qZWN0cyUyRkVaVml6JTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRnZpY3RvcndpbHNvbiUyRkRlc2t0b3AlMkZwcm9qZWN0cyUyRkVaVml6JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUM0QjtBQUN6RztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL3ZpY3RvcndpbHNvbi9EZXNrdG9wL3Byb2plY3RzL0VaVml6L2FwcC9hcGkvc25vd2ZsYWtlL3NjaGVtYS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvc25vd2ZsYWtlL3NjaGVtYS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3Nub3dmbGFrZS9zY2hlbWFcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3Nub3dmbGFrZS9zY2hlbWEvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvdmljdG9yd2lsc29uL0Rlc2t0b3AvcHJvamVjdHMvRVpWaXovYXBwL2FwaS9zbm93Zmxha2Uvc2NoZW1hL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsnowflake%2Fschema%2Froute&page=%2Fapi%2Fsnowflake%2Fschema%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsnowflake%2Fschema%2Froute.ts&appDir=%2FUsers%2Fvictorwilson%2FDesktop%2Fprojects%2FEZViz%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fvictorwilson%2FDesktop%2Fprojects%2FEZViz&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "@aws-sdk/client-s3":
/*!*************************************!*\
  !*** external "@aws-sdk/client-s3" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@aws-sdk/client-s3");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "http2":
/*!************************!*\
  !*** external "http2" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("http2");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:events":
/*!******************************!*\
  !*** external "node:events" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:events");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:fs/promises":
/*!***********************************!*\
  !*** external "node:fs/promises" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs/promises");

/***/ }),

/***/ "node:http":
/*!****************************!*\
  !*** external "node:http" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:http");

/***/ }),

/***/ "node:https":
/*!*****************************!*\
  !*** external "node:https" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:https");

/***/ }),

/***/ "node:os":
/*!**************************!*\
  !*** external "node:os" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:os");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ "node:process":
/*!*******************************!*\
  !*** external "node:process" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:process");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream");

/***/ }),

/***/ "node:string_decoder":
/*!**************************************!*\
  !*** external "node:string_decoder" ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:string_decoder");

/***/ }),

/***/ "node:url":
/*!***************************!*\
  !*** external "node:url" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:url");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:util");

/***/ }),

/***/ "node:zlib":
/*!****************************!*\
  !*** external "node:zlib" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:zlib");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "perf_hooks":
/*!*****************************!*\
  !*** external "perf_hooks" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("perf_hooks");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "string_decoder":
/*!*********************************!*\
  !*** external "string_decoder" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@azure","vendor-chunks/moment-timezone","vendor-chunks/snowflake-sdk","vendor-chunks/@google-cloud","vendor-chunks/google-auth-library","vendor-chunks/tr46","vendor-chunks/async","vendor-chunks/moment","vendor-chunks/mime-db","vendor-chunks/asn1.js","vendor-chunks/axios","vendor-chunks/glob","vendor-chunks/toml","vendor-chunks/readable-stream","vendor-chunks/winston","vendor-chunks/bn.js","vendor-chunks/bignumber.js","vendor-chunks/path-scurry","vendor-chunks/fast-xml-parser","vendor-chunks/semver","vendor-chunks/lru-cache","vendor-chunks/teeny-request","vendor-chunks/big-integer","vendor-chunks/gaxios","vendor-chunks/node-fetch","vendor-chunks/generic-pool","vendor-chunks/whatwg-url","vendor-chunks/long","vendor-chunks/mime","vendor-chunks/@smithy","vendor-chunks/colorspace","vendor-chunks/jsonwebtoken","vendor-chunks/html-entities","vendor-chunks/minipass","vendor-chunks/asn1.js-rfc5280","vendor-chunks/json-bigint","vendor-chunks/logform","vendor-chunks/@techteamer","vendor-chunks/event-target-shim","vendor-chunks/follow-redirects","vendor-chunks/python-struct","vendor-chunks/google-logging-utils","vendor-chunks/safe-stable-stringify","vendor-chunks/@colors","vendor-chunks/gcp-metadata","vendor-chunks/lodash.includes","vendor-chunks/debug","vendor-chunks/tslib","vendor-chunks/get-intrinsic","vendor-chunks/form-data","vendor-chunks/fecha","vendor-chunks/https-proxy-agent","vendor-chunks/gtoken","vendor-chunks/winston-transport","vendor-chunks/uuid","vendor-chunks/agent-base","vendor-chunks/string_decoder","vendor-chunks/asynckit","vendor-chunks/retry-request","vendor-chunks/@dabh","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/mkdirp","vendor-chunks/retry","vendor-chunks/http-proxy-agent","vendor-chunks/lodash.isinteger","vendor-chunks/duplexify","vendor-chunks/color-string","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/webidl-conversions","vendor-chunks/open","vendor-chunks/combined-stream","vendor-chunks/color-name","vendor-chunks/asn1.js-rfc2560","vendor-chunks/strnum","vendor-chunks/base64-js","vendor-chunks/lodash.isplainobject","vendor-chunks/fastest-levenshtein","vendor-chunks/mime-types","vendor-chunks/abort-controller","vendor-chunks/stack-trace","vendor-chunks/proxy-from-env","vendor-chunks/extend","vendor-chunks/triple-beam","vendor-chunks/simple-lru-cache","vendor-chunks/ms","vendor-chunks/supports-color","vendor-chunks/end-of-stream","vendor-chunks/kuler","vendor-chunks/has-symbols","vendor-chunks/delayed-stream","vendor-chunks/lodash.isstring","vendor-chunks/function-bind","vendor-chunks/safer-buffer","vendor-chunks/lodash.isnumber","vendor-chunks/homedir-polyfill","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/p-limit","vendor-chunks/parse-passwd","vendor-chunks/balanced-match","vendor-chunks/es-set-tostringtag","vendor-chunks/async-retry","vendor-chunks/get-proto","vendor-chunks/call-bind-apply-helpers","vendor-chunks/buffer-equal-constant-time","vendor-chunks/one-time","vendor-chunks/inherits","vendor-chunks/fn.name","vendor-chunks/dunder-proto","vendor-chunks/yocto-queue","vendor-chunks/once","vendor-chunks/wrappy","vendor-chunks/@tootallnate","vendor-chunks/math-intrinsics","vendor-chunks/enabled","vendor-chunks/stubs","vendor-chunks/binascii","vendor-chunks/is-stream","vendor-chunks/stream-shift","vendor-chunks/simple-swizzle","vendor-chunks/is-wsl","vendor-chunks/expand-tilde","vendor-chunks/es-errors","vendor-chunks/stream-events","vendor-chunks/text-hex","vendor-chunks/is-docker","vendor-chunks/arrify","vendor-chunks/has-flag","vendor-chunks/is-arrayish","vendor-chunks/gopd","vendor-chunks/es-define-property","vendor-chunks/minimalistic-assert","vendor-chunks/hasown","vendor-chunks/has-tostringtag","vendor-chunks/util-deprecate","vendor-chunks/es-object-atoms"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsnowflake%2Fschema%2Froute&page=%2Fapi%2Fsnowflake%2Fschema%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsnowflake%2Fschema%2Froute.ts&appDir=%2FUsers%2Fvictorwilson%2FDesktop%2Fprojects%2FEZViz%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fvictorwilson%2FDesktop%2Fprojects%2FEZViz&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();