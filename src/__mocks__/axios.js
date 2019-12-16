// Set up Jest to mock axios
const mockNoop = () => new Promise(() => {});

export default {
    default: mockNoop,
    get: mockNoop,
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: mockNoop,
    delete: mockNoop,
    patch: mockNoop,
};
