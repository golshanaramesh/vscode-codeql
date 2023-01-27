import { SchemaGenerator } from "../../../../src/data-serialization/schema-generator";

describe("Schema Generator", () => {
  let testGenerator: SchemaGenerator;

  beforeAll(async () => {
    testGenerator = new SchemaGenerator(["RemoteQueryHistoryItem"]);
  });

  it("should generate schema", async () => {
    const schemaContents = await testGenerator.generateSchema(
      "RemoteQueryHistoryItem",
    );

    const expectedContent = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $ref: "#/definitions/RemoteQueryHistoryItem",
      definitions: {
        RemoteQueryHistoryItem: {
          type: "object",
          properties: {
            t: {
              type: "string",
              const: "remote",
            },
            failureReason: {
              type: "string",
            },
            resultCount: {
              type: "number",
            },
            status: {
              $ref: "#/definitions/QueryStatus",
            },
            completed: {
              type: "boolean",
            },
            queryId: {
              type: "string",
            },
            remoteQuery: {
              type: "object",
              properties: {
                queryName: {
                  type: "string",
                },
                queryFilePath: {
                  type: "string",
                },
                queryText: {
                  type: "string",
                },
                language: {
                  type: "string",
                },
                controllerRepository: {
                  type: "object",
                  properties: {
                    owner: {
                      type: "string",
                    },
                    name: {
                      type: "string",
                    },
                  },
                  required: ["owner", "name"],
                  additionalProperties: false,
                },
                executionStartTime: {
                  type: "number",
                },
                actionsWorkflowRunId: {
                  type: "number",
                },
                repositoryCount: {
                  type: "number",
                },
              },
              required: [
                "queryName",
                "queryFilePath",
                "queryText",
                "language",
                "controllerRepository",
                "executionStartTime",
                "actionsWorkflowRunId",
                "repositoryCount",
              ],
              additionalProperties: false,
            },
            userSpecifiedLabel: {
              type: "string",
            },
          },
          required: ["t", "status", "completed", "queryId", "remoteQuery"],
          additionalProperties: false,
        },
        QueryStatus: {
          type: "string",
          enum: ["InProgress", "Completed", "Failed"],
        },
      },
    };

    expect(schemaContents).toEqual(JSON.stringify(expectedContent, null, 2));
  });
});