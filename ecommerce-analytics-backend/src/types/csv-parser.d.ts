declare module 'csv-parser' {
    import { Transform } from 'stream';
  
    interface CsvParserOptions {
      headers?: boolean | string[];
      separator?: string;
      
    }
  
    function csvParser(options?: CsvParserOptions): Transform;
  
    export = csvParser;
  }
  