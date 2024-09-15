export class CreateEnrollRequestDto {
    majorId: number
    studentId: number
    status: string
    selectedCourse: {
        courseId: number
        remark: string
    }[]
}
