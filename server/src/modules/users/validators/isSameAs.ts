import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from "class-validator"

// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsSameAs(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (
    // eslint-disable-next-line @typescript-eslint/ban-types
    object: { constructor: Function },
    propertyName: string
  ): void {
    registerDecorator({
      name: "isSameAs",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const [relatedPropertyName] = args.constraints
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName as string
          ]
          return (
            typeof value === "string" &&
            typeof relatedValue === "string" &&
            value === relatedValue
          )
        }
      }
    })
  }
}
