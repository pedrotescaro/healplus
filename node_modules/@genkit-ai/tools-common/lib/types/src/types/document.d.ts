import z from 'zod';
export declare const TextPartSchema: z.ZodObject<{
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    reasoning: z.ZodOptional<z.ZodNever>;
    resource: z.ZodOptional<z.ZodNever>;
} & {
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}, {
    text: string;
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}>;
export type TextPart = z.infer<typeof TextPartSchema>;
export declare const ReasoningPartSchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    resource: z.ZodOptional<z.ZodNever>;
} & {
    reasoning: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reasoning: string;
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    resource?: undefined;
}, {
    reasoning: string;
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    resource?: undefined;
}>;
export type ReasoningPart = z.infer<typeof ReasoningPartSchema>;
export declare const MediaSchema: z.ZodObject<{
    contentType: z.ZodOptional<z.ZodString>;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
    contentType?: string | undefined;
}, {
    url: string;
    contentType?: string | undefined;
}>;
export declare const MediaPartSchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    reasoning: z.ZodOptional<z.ZodNever>;
    resource: z.ZodOptional<z.ZodNever>;
} & {
    media: z.ZodObject<{
        contentType: z.ZodOptional<z.ZodString>;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        contentType?: string | undefined;
    }, {
        url: string;
        contentType?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    media: {
        url: string;
        contentType?: string | undefined;
    };
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}, {
    media: {
        url: string;
        contentType?: string | undefined;
    };
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}>;
export type MediaPart = z.infer<typeof MediaPartSchema>;
export declare const ToolRequestSchema: z.ZodObject<{
    ref: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    input: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    name: string;
    ref?: string | undefined;
    input?: unknown;
}, {
    name: string;
    ref?: string | undefined;
    input?: unknown;
}>;
export declare const ToolRequestPartSchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    reasoning: z.ZodOptional<z.ZodNever>;
    resource: z.ZodOptional<z.ZodNever>;
} & {
    toolRequest: z.ZodObject<{
        ref: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        input: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        ref?: string | undefined;
        input?: unknown;
    }, {
        name: string;
        ref?: string | undefined;
        input?: unknown;
    }>;
}, "strip", z.ZodTypeAny, {
    toolRequest: {
        name: string;
        ref?: string | undefined;
        input?: unknown;
    };
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}, {
    toolRequest: {
        name: string;
        ref?: string | undefined;
        input?: unknown;
    };
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}>;
export type ToolRequestPart = z.infer<typeof ToolRequestPartSchema>;
export declare const ToolResponseSchema: z.ZodObject<{
    ref: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    output: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    name: string;
    ref?: string | undefined;
    output?: unknown;
}, {
    name: string;
    ref?: string | undefined;
    output?: unknown;
}>;
export declare const ToolResponsePartSchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    reasoning: z.ZodOptional<z.ZodNever>;
    resource: z.ZodOptional<z.ZodNever>;
} & {
    toolResponse: z.ZodObject<{
        ref: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        output: z.ZodOptional<z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        ref?: string | undefined;
        output?: unknown;
    }, {
        name: string;
        ref?: string | undefined;
        output?: unknown;
    }>;
}, "strip", z.ZodTypeAny, {
    toolResponse: {
        name: string;
        ref?: string | undefined;
        output?: unknown;
    };
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}, {
    toolResponse: {
        name: string;
        ref?: string | undefined;
        output?: unknown;
    };
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}>;
export type ToolResponsePart = z.infer<typeof ToolResponsePartSchema>;
export declare const DataPartSchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    reasoning: z.ZodOptional<z.ZodNever>;
    resource: z.ZodOptional<z.ZodNever>;
} & {
    data: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}, {
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}>;
export type DataPart = z.infer<typeof DataPartSchema>;
export declare const CustomPartSchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    reasoning: z.ZodOptional<z.ZodNever>;
    resource: z.ZodOptional<z.ZodNever>;
} & {
    custom: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    custom: Record<string, any>;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}, {
    custom: Record<string, any>;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}>;
export type CustomPart = z.infer<typeof CustomPartSchema>;
export declare const ResourcePartSchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodNever>;
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    reasoning: z.ZodOptional<z.ZodNever>;
} & {
    resource: z.ZodObject<{
        uri: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        uri: string;
    }, {
        uri: string;
    }>;
}, "strip", z.ZodTypeAny, {
    resource: {
        uri: string;
    };
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
}, {
    resource: {
        uri: string;
    };
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
}>;
export type ResourcePart = z.infer<typeof ResourcePartSchema>;
export declare const DocumentPartSchema: z.ZodUnion<[z.ZodObject<{
    media: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    reasoning: z.ZodOptional<z.ZodNever>;
    resource: z.ZodOptional<z.ZodNever>;
} & {
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}, {
    text: string;
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    media?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}>, z.ZodObject<{
    text: z.ZodOptional<z.ZodNever>;
    toolRequest: z.ZodOptional<z.ZodNever>;
    toolResponse: z.ZodOptional<z.ZodNever>;
    data: z.ZodOptional<z.ZodUnknown>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    reasoning: z.ZodOptional<z.ZodNever>;
    resource: z.ZodOptional<z.ZodNever>;
} & {
    media: z.ZodObject<{
        contentType: z.ZodOptional<z.ZodString>;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        contentType?: string | undefined;
    }, {
        url: string;
        contentType?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    media: {
        url: string;
        contentType?: string | undefined;
    };
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}, {
    media: {
        url: string;
        contentType?: string | undefined;
    };
    custom?: Record<string, unknown> | undefined;
    metadata?: Record<string, unknown> | undefined;
    text?: undefined;
    toolRequest?: undefined;
    toolResponse?: undefined;
    data?: unknown;
    reasoning?: undefined;
    resource?: undefined;
}>]>;
export type DocumentPart = z.infer<typeof DocumentPartSchema>;
export declare const DocumentDataSchema: z.ZodObject<{
    content: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        media: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        reasoning: z.ZodOptional<z.ZodNever>;
        resource: z.ZodOptional<z.ZodNever>;
    } & {
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        custom?: Record<string, unknown> | undefined;
        metadata?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        reasoning?: undefined;
        resource?: undefined;
    }, {
        text: string;
        custom?: Record<string, unknown> | undefined;
        metadata?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        reasoning?: undefined;
        resource?: undefined;
    }>, z.ZodObject<{
        text: z.ZodOptional<z.ZodNever>;
        toolRequest: z.ZodOptional<z.ZodNever>;
        toolResponse: z.ZodOptional<z.ZodNever>;
        data: z.ZodOptional<z.ZodUnknown>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        reasoning: z.ZodOptional<z.ZodNever>;
        resource: z.ZodOptional<z.ZodNever>;
    } & {
        media: z.ZodObject<{
            contentType: z.ZodOptional<z.ZodString>;
            url: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            url: string;
            contentType?: string | undefined;
        }, {
            url: string;
            contentType?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        metadata?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        reasoning?: undefined;
        resource?: undefined;
    }, {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        metadata?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        reasoning?: undefined;
        resource?: undefined;
    }>]>, "many">;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    content: ({
        text: string;
        custom?: Record<string, unknown> | undefined;
        metadata?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        reasoning?: undefined;
        resource?: undefined;
    } | {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        metadata?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        reasoning?: undefined;
        resource?: undefined;
    })[];
    metadata?: Record<string, any> | undefined;
}, {
    content: ({
        text: string;
        custom?: Record<string, unknown> | undefined;
        metadata?: Record<string, unknown> | undefined;
        media?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        reasoning?: undefined;
        resource?: undefined;
    } | {
        media: {
            url: string;
            contentType?: string | undefined;
        };
        custom?: Record<string, unknown> | undefined;
        metadata?: Record<string, unknown> | undefined;
        text?: undefined;
        toolRequest?: undefined;
        toolResponse?: undefined;
        data?: unknown;
        reasoning?: undefined;
        resource?: undefined;
    })[];
    metadata?: Record<string, any> | undefined;
}>;
export type DocumentData = z.infer<typeof DocumentDataSchema>;
