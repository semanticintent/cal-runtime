/**
 * Type declaration for generated Peggy parser
 */
import type { Program } from '../types/index.js';

export interface Parser {
  parse(input: string): Program;
}

declare const parser: Parser;
export default parser;
