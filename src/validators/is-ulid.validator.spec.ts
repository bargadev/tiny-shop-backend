import { validate } from 'class-validator';
import { ulid } from 'ulid';
import { IsUlid } from './is-ulid.validator';

class TestDto {
  @IsUlid()
  item_id: string;
}

describe('IsUlid Validator', () => {
  it('should validate a valid ULID', async () => {
    const dto = new TestDto();
    dto.item_id = ulid(); // Generate a valid ULID

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate a valid ULID (fixed example)', async () => {
    const dto = new TestDto();
    dto.item_id = '01ARZ3NDEKTSV4RRFFQ69G5FAV'; // Valid ULID format

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for a string that is too short', async () => {
    const dto = new TestDto();
    dto.item_id = '01ARZ3NDEKTSV4RRFFQ69G5'; // Only 24 characters

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('item_id');
    expect(errors[0].constraints?.isUlid).toContain('must be a valid ULID');
  });

  it('should fail validation for a string that is too long', async () => {
    const dto = new TestDto();
    dto.item_id = '01ARZ3NDEKTSV4RRFFQ69G5FAVXX'; // 28 characters

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('item_id');
  });

  it('should fail validation for invalid characters', async () => {
    const dto = new TestDto();
    dto.item_id = '01ARZ3NDEKTSV4RRFFQ69G5FAI'; // Contains 'I' which is invalid

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('item_id');
  });

  it('should fail validation for a ULID with invalid characters (L, O, U)', async () => {
    const dto = new TestDto();
    dto.item_id = '01ARZ3NDEKTSV4RRFFQ69G5FOL'; // Contains 'O' and 'L' which are invalid

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation for non-string values', async () => {
    const dto = new TestDto();
    dto.item_id = 12345 as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('item_id');
  });

  it('should fail validation for empty string', async () => {
    const dto = new TestDto();
    dto.item_id = '';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate lowercase ULID (case insensitive)', async () => {
    const dto = new TestDto();
    dto.item_id = '01arz3ndektsv4rrffq69g5fav'; // lowercase

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate mixed case ULID', async () => {
    const dto = new TestDto();
    dto.item_id = '01ArZ3NdEkTsV4RrFfQ69g5FaV'; // mixed case

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
